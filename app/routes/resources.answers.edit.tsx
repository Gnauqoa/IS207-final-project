import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { authGuard } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";

export const AnswerEditSchema = z.object({
  answerId: z.string().optional(),
  content: z.string(),
  questionId: z.string().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await authGuard(request);
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: AnswerEditSchema,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }
  if (
    !submission.value ||
    (!submission.value.answerId && !submission.value.questionId)
  ) {
    return json(
      {
        status: "error",
        submission,
      } as const,
      { status: 400 }
    );
  }
  if (submission.value.questionId) {
    const answer = await prisma.answer.create({
      data: {
        questionId: submission.value.questionId,
        content: submission.value.content,
        userId: userId,
      },
    });
    return json({ submission: answer, status: "success" }, { status: 201 });
  }
  const answer = await prisma.answer.update({
    where: {
      id: submission.value.answerId,
    },
    data: {
      content: submission.value.content,
    },
  });
  return json({ submission: answer, status: "success" }, { status: 201 });
};
