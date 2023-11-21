import { Button, TextareaAutosize, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

const InlineEditor = ({
  inputProps,
  labelSubmit = "Hỏi",
  errors,
  onClose,
}: {
  errors?: string[];
  inputProps?: React.HTMLProps<HTMLTextAreaElement>;
  labelSubmit?: string;
  onClose?: () => void;
}) => {
  const textArea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const length = textArea.current?.value.length || 0;
    textArea.current?.setSelectionRange(length, length);
    textArea.current?.blur(); // add this line to unfocus the textarea
  }, [textArea]);
  return (
    <div
      className="flex flex-col gap-4 px-6 py-3"
      onClick={() => {
        if (textArea) textArea.current?.focus();
      }}
    >
      <div className="flex flex-col gap-2">
        <TextareaAutosize
          {...inputProps}
          ref={textArea}
          className={"w-full text-sm outline-none transition-colors"}
        />
        {errors &&
          errors.map((error, index) => (
            <Typography sx={{ fontSize: 12, color: "red" }} key={error + index}>
              {error}
            </Typography>
          ))}
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!!onClose && (
          <Button onClick={onClose} type="button">
            Hủy
          </Button>
        )}
        <Button type="submit">{labelSubmit}</Button>
      </div>
    </div>
  );
};
export default InlineEditor;
