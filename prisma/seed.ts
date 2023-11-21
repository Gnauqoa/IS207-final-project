import fs from "fs";
import { faker } from "@faker-js/faker";
import { createPassword, createUser } from "tests/db-utils";
import { prisma } from "~/utils/db.server";
import { deleteAllData } from "tests/setup/utils";
import { getPasswordHash } from "~/utils/auth.server";

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  deleteAllData();
  console.timeEnd("🧹 Cleaned up the database...");
  console.time(
    `🐨 Created user "kody" with the password "123456" and admin role`
  );
  await prisma.user.create({
    data: {
      email: "kody@kcd.dev",
      name: "Kody",
      avatar: {
        create: {
          contentType: "image/png",
          blob: await fs.promises.readFile(
            "./tests/fixtures/images/user/kody.png"
          ),
        },
      },
      password: {
        create: {
          hash: await getPasswordHash("123456"),
        },
      },
    },
  });
  console.timeEnd(
    `🐨 Created user "kody" with the password "123456" and admin role`
  );
  const totalUsers = 40;
  console.time(`👤 Created ${totalUsers} users...`);
  const users = await Promise.all(
    Array.from({ length: totalUsers }, async (_, index) => {
      const userData = createUser();
      const userCreatedUpdated = getCreatedAndUpdated();
      const user = await prisma.user
        .create({
          select: { id: true },
          data: {
            ...userData,
            ...userCreatedUpdated,
            password: {
              create: createPassword(userData.email),
            },
            avatar: {
              create: {
                contentType: "image/jpeg",
                blob: await fs.promises.readFile(
                  `./tests/fixtures/images/user/${index % 10}.jpg`
                ),
              },
            },

            questions: {
              create: {
                content: faker.lorem.sentence(),
                ...getCreatedAndUpdated(userCreatedUpdated.createdAt),
              },
            },
          },
        })
        .catch(() => null);
      return user;
    })
  ).then((users) => users.filter(Boolean));
  console.timeEnd(`👤 Created ${users.length} users...`);

  const questions = await prisma.question
    .findMany({
      select: { id: true },
    })
    .then((questions) => questions);

  await prisma.user
    .findMany({
      select: { id: true },
    })
    .then((users) => {
      Array.from(users, async (user) => {
        return Array.from({ length: 1 }, async () => {
          const answer = await prisma.answer.create({
            data: {
              question: {
                connect: {
                  id: questions[0].id,
                  // faker.number.int({ min: 0, max: questions.length - 1 })
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
              content: faker.lorem.paragraphs(),
              ...getCreatedAndUpdated(),
            },
          });
          return answer;
        });
      });
    });

  console.timeEnd(`👤 Created ${users.length} answers...`);

  console.timeEnd(`🌱 Database has been seeded`);
}

function getCreatedAndUpdated(from: Date = new Date(2020, 0, 1)) {
  const createdAt = faker.date.between({ from, to: new Date() });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  return { createdAt, updatedAt };
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/
