import dayjs from "~/config/dayjs";
import { Avatar } from "..";
import { Typography } from "@mui/material";
import { type QuestionComponentType } from ".";

interface ContentProps {
  question: QuestionComponentType;
}

const Content: React.FC<ContentProps> = ({ question }) => {
  return (
    <div className="flex flex-col gap-2">
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

export default Content;
