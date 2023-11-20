import { type Password, type User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/utils/db.server";
import { invariant } from "./misc";
import { sessionStorage } from "./session.server";

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
