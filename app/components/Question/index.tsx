import { Prisma } from "@prisma/client";
import { type SerializeFrom } from "@remix-run/node";
import Content from "../Content";
import AnswerEditor from "./AddAnswer";
import { EditorType } from "../Editor";
import Answers from "./Answers";
import { answerSelect } from "../Answer";

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
  answers: { select: answerSelect },
  createdAt: true,
};

const questionWithUser = Prisma.validator<Prisma.QuestionDefaultArgs>()({
  select: questionSelect,
});

export type QuestionComponentType = SerializeFrom<
  Prisma.QuestionGetPayload<typeof questionWithUser>
>;

const Question = ({ question }: { question: QuestionComponentType }) => {
  if (!question) return <></>;
  return (
    <div className="flex flex-col w-full p-4 gap-2 border-b-[1px] border-gray-300">
      <Content content={question} />
      <AnswerEditor parentId={question.id} editorType={EditorType.new} />
      <Answers answers={question.answers} />
    </div>
  );
};

export default Question;
