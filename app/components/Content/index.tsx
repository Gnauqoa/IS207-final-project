import dayjs from "~/config/dayjs";
import { Avatar } from "..";
import { Typography } from "@mui/material";
import { type QuestionComponentType } from "../Question";
import { type AnswerComponentType } from "../Answer";

interface ContentProps {
  content: QuestionComponentType | AnswerComponentType;
}

const Content: React.FC<ContentProps> = ({ content }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-1 ">
        <Avatar user={content.user} />
        <div className="flex flex-col">
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            {content.user.name}
          </Typography>
          <Typography sx={{ fontSize: 10 }}>
            {dayjs(new Date(content.createdAt || "")).fromNow()}
          </Typography>
        </div>
      </div>
      <Typography sx={{ fontSize: 14 }}>{content.content}</Typography>
    </div>
  );
};

export default Content;
