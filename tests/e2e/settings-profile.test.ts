// import { faker } from '@faker-js/faker'
// import { expect, insertNewUser, test } from '../playwright-utils.ts'
// import { createUser } from '../../tests/db-utils.ts'
// import { verifyLogin } from '~/utils/auth.server.ts'

// test('Users can update their basic info', async ({ login, page }) => {
// 	await login()
// 	await page.goto('/settings/profile')

// 	const newUserData = createUser()

// 	await page.getByRole('textbox', { name: /^tên/i }).fill(newUserData.name)
// 	await page
// 		.getByRole('textbox', { name: /^tên thiệt/i })
// 		.fill(newUserData.username)
// 	// TODO: support changing the email... probably test this in another test though
// 	// await page.getByRole('textbox', {name: /^email/i}).fill(newUserData.email)

// 	await page.getByRole('button', { name: /^lưu/i }).click()

// 	await expect(page).toHaveURL(`/users/${newUserData.username}`)
// })

// test('Users can update their password', async ({ login, page }) => {
// 	const oldPassword = faker.internet.password()
// 	const newPassword = faker.internet.password()
// 	const user = await insertNewUser({ password: oldPassword })
// 	await login(user)
// 	await page.goto('/settings/profile')

// 	const fieldset = page.getByRole('group', { name: /đổi mật khẩu/i })

// 	await fieldset
// 		.getByRole('textbox', { name: /^mật khẩu đang dùng/i })
// 		.fill(oldPassword)
// 	await fieldset
// 		.getByRole('textbox', { name: /^mật khẩu muốn đổi/i })
// 		.fill(newPassword)

// 	await page.getByRole('button', { name: /^lưu/i }).click()

// 	await expect(page).toHaveURL(`/users/${user.username}`)

// 	expect(
// 		await verifyLogin(user.username, oldPassword),
// 		'Mật khẩu cũ vẫn ngon lành',
// 	).toEqual(null)
// 	expect(
// 		await verifyLogin(user.username, newPassword),
// 		'Mật khẩu mới không ăn thua',
// 	).toEqual({ id: user.id, name: user.name, email: user.email })
// })

// // test('Users can update their profile photo', async ({ login, page }) => {
// // 	const user = await login()
// // 	await page.goto('/settings/profile')

// // 	const beforeSrc = await page
// // 		.getByRole('img', { name: user.name ?? user.username })
// // 		.getAttribute('src')

// // 	await page.getByRole('link', { name: /đổi ảnh đại diện/i }).click()

// // 	await expect(page).toHaveURL(`/settings/profile/photo`)

// // 	await page
// // 		.getByRole('textbox', { name: /đổi/i })
// // 		.setInputFiles('./tests/fixtures/test-profile.jpg')

// // 	await page.getByRole('button', { name: /save/i }).click()

// // 	await expect(
// // 		page,
// // 		'Was not redirected after saving the profile photo',
// // 	).toHaveURL(`/settings/profile`)

// // 	const afterSrc = await page
// // 		.getByRole('img', { name: user.name ?? user.username })
// // 		.getAttribute('src')

// // 	expect(beforeSrc).not.toEqual(afterSrc)
// // })
