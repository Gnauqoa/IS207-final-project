import { Container, Html, Link, Tailwind, Text } from "@react-email/components";
import tailwindConfig from "tailwind.config";
import { prisma } from "~/utils/db.server";
import { generateTOTP } from "~/utils/totp.server";

import { getDomainUrl } from "~/utils/misc";
import { sendEmail } from "./email.server";

export const onboardingOTPQueryParam = "code";
export const onboardingEmailQueryParam = "email";
export const onboardingEmailSessionKey = "onboardingEmail";
export const verificationType = "onboarding";

export function SignupEmail({
  onboardingUrl,
  otp,
}: {
  onboardingUrl: string;
  otp: string;
}) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html lang="en" dir="ltr">
        <Container>
          <h1>
            <Text>Doxa chào bạn!</Text>
          </h1>

          <p>
            <Text>Vào đường dẫn bên dưới để xác nhận tài khoản:</Text>
          </p>
          <Link href={onboardingUrl}>{onboardingUrl}</Link>
        </Container>
      </Html>
    </Tailwind>
  );
}

export const sendEmailVerify = async (email: string, request: Request) => {
  const thirtyMinutesInSeconds = 30 * 60;
  const { otp, secret, algorithm, period, digits } = generateTOTP({
    algorithm: "SHA256",
    period: thirtyMinutesInSeconds,
  });

  await prisma.verification.deleteMany({
    where: { type: verificationType, target: email },
  });
  await prisma.verification.create({
    data: {
      type: verificationType,
      target: email,
      algorithm,
      secret,
      period,
      digits,
      expiresAt: new Date(Date.now() + period * 1000),
    },
  });
  const onboardingUrl = new URL(
    `${getDomainUrl(request)}/v2/auth/signup/verify`
  );
  onboardingUrl.searchParams.set(onboardingEmailQueryParam, email);

  // add the otp to the url we'll email the user.
  onboardingUrl.searchParams.set(onboardingOTPQueryParam, otp);

  await sendEmail({
    to: email,
    subject: `Doxa chào bạn!`,
    react: <SignupEmail onboardingUrl={onboardingUrl.toString()} otp={otp} />,
  });
};
