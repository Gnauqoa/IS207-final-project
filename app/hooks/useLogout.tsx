import { useFetcher } from '@remix-run/react'

const useLogout = () => {
	const fetcher = useFetcher()
	const logout = () => {
		fetcher.submit({}, { method: 'post', action: '/v2/logout' })
	}

	return logout
}

export default useLogout
