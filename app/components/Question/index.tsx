import { Prisma } from "@prisma/client";
import { type SerializeFrom } from "@remix-run/node";
import Content from "../Content";
import AnswerEditor from "./AddAnswer";
import { EditorType } from "../Editor";
import Answers from "./Answers";
import { useState } from "react";

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
  answers: {
    select: {
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
    },
  },
  createdAt: true,
};

const questionWithUser = Prisma.validator<Prisma.QuestionDefaultArgs>()({
  select: questionSelect,
});

export type QuestionComponentType = SerializeFrom<
  Prisma.QuestionGetPayload<typeof questionWithUser>
>;

const Question = ({ question }: { question: QuestionComponentType }) => {
  const [currentQuestion, setCurrentQuestion] = useState(question);
  if (!currentQuestion) return <></>;
  return (
    <div className="flex flex-col w-full p-4 gap-2 border-b-[1px] border-gray-300">
      <Content content={currentQuestion} />
      <AnswerEditor
        onSuccess={(data) =>
          setCurrentQuestion((prev) => ({
            ...prev,
            answers: [data, ...prev.answers],
          }))
        }
        parentId={currentQuestion.id}
        editorType={EditorType.new}
      />
      <Answers answers={currentQuestion.answers} />
    </div>
  );
};

export default Question;
