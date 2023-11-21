import dayjs from "~/config/dayjs";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserId } from "~/utils/auth.server";
import { makeTimings, time } from "~/utils/timing.server";
import { prisma } from "~/utils/db.server";
import { getEnv } from "~/utils/env.server";
import { combineHeaders, getDomainUrl } from "~/utils/misc";
import { getHints } from "~/utils/client-hints";
import { PATH_PAGE } from "~/config/path";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const timings = makeTimings("root loader");
  const userId = await time(() => getUserId(request), {
    timings,
    type: "getUserId",
    desc: "getUserId in root",
  });
  const requestUrl = new URL(request.url);

  if (!userId) {
    if (!requestUrl.pathname.includes("/auth/login"))
      return redirect(PATH_PAGE.login);
  } else if (requestUrl.pathname.includes("/auth/login"))
    return redirect(PATH_PAGE.login);
    
  const user = userId
    ? await time(
        () =>
          prisma.user.findUnique({
            where: { id: userId },
            select: {
              createdAt: true,
              verified: true,
              email: true,
              id: true,
              name: true,
              avatarId: true,
              questions: {
                select: { id: true },
              },
            },
          }),
        { timings, type: "find user", desc: "find user in root" }
      )
    : null;
  const expired =
    user?.createdAt &&
    !user.verified &&
    dayjs().diff(dayjs(user.createdAt), "hour") > 48;

  return json(
    {
      user: {
        ...user,

        expired,
      },
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      ENV: getEnv(),
    },
    {
      headers: combineHeaders({ "Server-Timing": timings.toString() }),
    }
  );
};
