import dayjs from "~/config/dayjs";
import { Prisma } from "@prisma/client";
import { Avatar } from "..";
import { Typography } from "@mui/material";
import { type SerializeFrom } from "@remix-run/node";

export const questionSelect: Prisma.QuestionSelect = {
  id: true,
  content: true,
  user: {
    select: {
      id: true,
      name: true,
      avatarId: true,
    },
  },
  createdAt: true,
};

const questionWithUser = Prisma.validator<Prisma.QuestionDefaultArgs>()({
  select: questionSelect,
});

export type QuestionComponentType = Prisma.QuestionGetPayload<
  typeof questionWithUser
>;

const Question = ({
  question,
}: {
  question: SerializeFrom<QuestionComponentType>;
}) => {
  if (!question) return <></>;
  return (
    <div className="flex flex-col w-full p-4 gap-2 border-b-[1px] border-gray-300">
      <div className="flex flex-row gap-1 ">
        <Avatar user={question.user} />
        <div className="flex flex-col">
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            {question.user.name}
          </Typography>
          <Typography sx={{ fontSize: 10 }}>
            {dayjs(new Date(question.createdAt || "")).fromNow()}
          </Typography>
        </div>
      </div>
      <Typography sx={{ fontSize: 14 }}>{question.content}</Typography>
    </div>
  );
};

export default Question;
