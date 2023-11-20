import { useLocation } from '@remix-run/react'
import { V2_PATH_PAGE } from '~/config/path.ts'

export enum LayoutType {
	auth = 'Auth',
	main = 'Main',
}

const useLayout = (): LayoutType => {
	const location = useLocation()
	const path = location.pathname.split('/')
	if (
		path.includes('auth') ||
		location.pathname.includes(V2_PATH_PAGE.onboarding)
	)
		return LayoutType.auth
	return LayoutType.main
}

export default useLayout
