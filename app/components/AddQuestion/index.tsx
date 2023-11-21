import { useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  type action,
  QuestionEditSchema,
} from "~/routes/resources.questions.edit";
import { type EditorProps, EditorType, InlineEditor } from "../Editor";
import { type Question } from "@prisma/client";
import { LinearProgress } from "@mui/material";
import { type SerializeFrom } from "@remix-run/node";

const QuestionEditor = ({
  onClose,
  onError,
  onSubmit,
  onSuccess,
  editorType,
  defaultValue = "",
  parentId,
  id,
}: EditorProps) => {
  const fetcher = useFetcher<typeof action>();
  const [value, setValue] = useState(defaultValue);
  const loading = fetcher.state !== "idle";
  const [form, fields] = useForm({
    id: "question-editor",
    constraint: getFieldsetConstraint(QuestionEditSchema),
    onValidate: ({ formData }) => {
      return parse(formData, {
        schema: QuestionEditSchema,
      });
    },
    defaultValue: {
      content: defaultValue,
    },
    shouldRevalidate: "onBlur",
  });
  const handleSubmitting = () => {
    if (onSubmit) onSubmit(value);
  };
  const handleComplete = () => {
    if (fetcher.data?.status) {
      setValue("");
      if (fetcher.data?.status !== "success") {
        const question = fetcher.data?.submission as SerializeFrom<Question>;
        setValue(question.content || "");
        if (onError) onError();
      } else {
        if (onSuccess)
          onSuccess(fetcher.data.submission as SerializeFrom<Question>);
      }
    }
  };
  useEffect(() => {
    switch (fetcher.state) {
      case "submitting":
        handleSubmitting();
        break;
      case "idle":
        handleComplete();
        break;
      default:
        break;
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      method="post"
      action={`/resources/questions/edit`}
      className="flex w-full flex-col gap-2"
      {...form.props}
    >
      {loading && (
        <div className="absolute flex h-full w-full flex-col bg-white opacity-70"></div>
      )}
      {loading && <LinearProgress />}
      <input name="questionId" hidden defaultValue={parentId} />
      <InlineEditor
        onClose={onClose}
        inputProps={{
          value: value,
          onChange: (e) => setValue(e.currentTarget.value),
          name: "content",
          placeholder: "Trả lời",
        }}
        errors={fields.content.errors?.filter(Boolean)}
        labelSubmit={editorType === EditorType.edit ? "Đáp" : "Trả lời"}
      />
    </fetcher.Form>
  );
};

export default QuestionEditor;
