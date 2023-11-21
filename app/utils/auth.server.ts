import { type Password, type User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/utils/db.server";
import { invariant } from "./misc";
import { sessionStorage } from "./session.server";
import { redirect } from "@remix-run/node";
import dayjs from "dayjs";
import { PATH_PAGE } from "~/config/path";

export type { User };
export const CONTENT_LIMIT_FOR_GUEST = 1;
export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: "sessionId",
});

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    invariant(typeof email === "string", "Tài khoản phải là một chuỗi");
    invariant(email.length > 0, "Tài khoản không được để trống");

    invariant(typeof password === "string", "Mật khẩu phải là một chuỗi");
    invariant(password.length > 0, "Mật khẩu không được để trống");

    const user = await verifyLogin(email, password);
    if (!user) {
      throw new Error("Tài khoản hoặc mật khẩu không đúng");
    }

    const options = {
      method: "POST",
      headers: { accept: "text/plain", "content-type": "application/json" },
      body: JSON.stringify([
        {
          $distinct_id: user.id,
          $set: {
            $user_id: user.id,
            $name: user.name,
            $email: user.email,
          },
        },
      ]),
    };

    fetch("https://api.mixpanel.com/engage#profile-set", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    const session = await prisma.session.create({
      data: {
        expirationDate: new Date(Date.now() + SESSION_EXPIRATION_TIME),
        userId: user.id,
      },
      select: { id: true },
    });

    return session.id;
  }),
  FormStrategy.name
);

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: { select: { hash: true } },
      name: true,
      email: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  return {
    id: userWithPassword.id,
    name: userWithPassword.name,
    email: userWithPassword.email,
  };
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}
export async function getUserId(request: Request) {
  const sessionId = await authenticator.isAuthenticated(request);
  if (!sessionId) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });
  if (!session) {
    // Perhaps their session was deleted?
    await authenticator.logout(request, { redirectTo: "/" });
    return null;
  }
  return session.userId;
}
export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {}
) {
  const requestUrl = new URL(request.url);
  redirectTo =
    redirectTo === null
      ? null
      : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`;
  const loginParams = redirectTo
    ? new URLSearchParams([["redirectTo", redirectTo]])
    : null;
  const failureRedirect = [PATH_PAGE.login, loginParams?.toString()]
    .filter(Boolean)
    .join("?");
  const sessionId = await authenticator.isAuthenticated(request, {
    failureRedirect,
  });
  const session = await prisma.session.findFirst({
    where: { id: sessionId },
    select: {
      userId: true,
      user: { select: { verified: true, createdAt: true } },
      expirationDate: true,
    },
  });

  if (!session) {
    throw redirect(failureRedirect);
  }
  const expired =
    session.user?.createdAt &&
    !session.user.verified &&
    dayjs().diff(dayjs(session.user.createdAt), "hour") > 48;
  if (expired) throw redirect(failureRedirect);
  return session.userId;
}
export const authGuard = async (request: Request, redirectTo?: string) => {
  return await requireUserId(request, { redirectTo });
};
