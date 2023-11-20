import { type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { passwordSchema, usernameSchema } from "~/utils/user-validation";
import { parse } from '@conform-to/zod'

export const loginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  redirectTo: z.string().optional(),
  remember: z.string().transform((value) => value === "on"),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
	const submission = parse(formData, {
		schema: loginFormSchema,
		acceptMultipleErrors: () => true,
	})
	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}
	if (!submission.value) {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		)
	}

	let sessionId: string | null = null
	try {
		sessionId = await authenticator.authenticate(FormStrategy.name, request, {
			throwOnError: true,
			context: { formData },
		})
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return json(
				{
					status: 'error',
					submission: {
						...submission,
						error: {
							'': error.message,
						},
					},
				} as const,
				{ status: 400 },
			)
		}
		throw error
	}

	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		select: { userId: true, expirationDate: true },
	})
	invariantResponsec(session, 'newly created session not found')

	const user = await prisma.user.findUnique({
		where: { id: session.userId },
		select: { verified: true, createdAt: true, email: true },
	})
	const expired =
		user?.createdAt &&
		!user.verified &&
		dayjs().diff(dayjs(user.createdAt), 'hour') > 48
	if (expired) {
		const verification = await prisma.verification.findFirst({
			where: { type: verificationType, target: user.email },
			select: { id: true, expiresAt: true },
		})
		if (!verification) {
			await sendEmailVerify(user.email, request)
		}
		return json(
			{
				status: 'error',
				submission: {
					...submission,
					error: {
						'': `Xin hãy xác nhận thông tin qua email chúng tôi gửi đến địa chỉ: ${user.email} `,
					},
				},
			} as const,
			{ status: 400 },
		)
	}

	const user2FA = await prisma.verification.findFirst({
		where: { type: twoFAVerificationType, target: session.userId },
		select: { id: true },
	})
	const cookieSession = await getSession(request.headers.get('cookie'))
	const keyToSet = user2FA ? unverifiedSessionKey : authenticator.sessionKey
	cookieSession.set(keyToSet, sessionId)
	const { remember, redirectTo } = submission.value
	const responseInit = {
		headers: {
			'Set-Cookie': await commitSession(cookieSession, {
				expires: remember ? session.expirationDate : undefined,
			}),
		},
	}
	if (user2FA || !redirectTo) {
		return json({ status: 'success', submission } as const, responseInit)
	} else {
		throw redirect(safeRedirect(redirectTo), responseInit)
	}
};
