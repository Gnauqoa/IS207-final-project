import Answer, { type AnswerComponentType } from "../Answer";

const Answers = ({
  answers,
}: {
  answers: AnswerComponentType[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {answers.map((answer) => (
        <Answer key={answer.id} answer={answer} />
      ))}
    </div>
  );
};

export default Answers;
