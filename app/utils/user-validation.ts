import { z } from 'zod'

export const passwordSchema = z
	.string()
	.min(6, { message: 'Mật khẩu quá ngắn' })
	.max(100, { message: 'Mật khẩu quá dài' })
export const nameSchema = z
	.string()
	.min(3, { message: 'Tên quá ngắn' })
	.max(40, { message: 'Tên quá dài' })
export const emailSchema = z
	.string()
	.email({ message: 'Thơ điện tử không hợp lệ' })
	.min(3, { message: 'Thơ điện tử quá ngắn' })
	.max(100, { message: 'Thơ điện tử quá dài' })
	// users can type the email in any case, but we store it in lowercase
	.transform(value => value.toLowerCase())
