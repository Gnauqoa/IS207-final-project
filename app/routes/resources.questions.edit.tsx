import { parse } from "@conform-to/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { authGuard } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";

export const QuestionEditSchema = z.object({
  questionId: z.string().optional(),
  content: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await authGuard(request);
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: QuestionEditSchema,
  });

  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }
  if (!submission.value) {
    return json(
      {
        status: "error",
        submission,
      } as const,
      { status: 400 }
    );
  }
  if (submission.value.questionId) {
    const question = await prisma.question.update({
      where: {
        id: submission.value.questionId,
      },
      data: {
        content: submission.value.content,
      },
    });
    return json({ submission: question, status: "success" }, { status: 201 });
  }
  const question = await prisma.question.create({
    data: {
      content: submission.value.content,
      userId: userId,
    },
  });
  return json({ submission: question, status: "success" }, { status: 201 });
};
