import { Prisma } from "@prisma/client";
import { type SerializeFrom } from "@remix-run/node";
import Content from "../Content";

export const answerSelect: Prisma.AnswerSelect = {
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

const answerWithUser = Prisma.validator<Prisma.AnswerDefaultArgs>()({
  include: { user: true, question: false },
  select: answerSelect,
});

export type AnswerComponentType = SerializeFrom<
  Prisma.AnswerGetPayload<typeof answerWithUser>
>;

const Answer = ({ answer }: { answer: AnswerComponentType }) => {
  if (!answer) return <></>;
  return (
    <div className="flex flex-col w-full p-4 gap-2 border-b-[1px]">
      <Content content={answer} />
    </div>
  );
};

export default Answer;
