import { Container } from "@mui/material";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Question } from "~/components";
import { questionSelect } from "~/components/Question";
import { prisma } from "~/utils/db.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    select: questionSelect,
  });
  return json({ questions });
};

const Home = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <Container>
      <div className="flex flex-col w-full border-x-[1px] border-gray-300">
        {data.questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div>{" "}
    </Container>
  );
};

export default Home;
