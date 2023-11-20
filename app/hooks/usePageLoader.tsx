import { type Fetcher, useFetcher, useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'

type usePageLoaderProps<T> = {
	perPage: number
	getItems?: (fetcher: Fetcher) => T[]
	action: string
	defaultValue?: T[]
	params?: object
}

function usePageLoader<T>({
	perPage,
	getItems = (fetcher: Fetcher) => {
		return fetcher.data?.items
	},
	action,
	params,
	defaultValue = [],
}: usePageLoaderProps<T>) {
	const [page, setPage] = useState(-1)
	const [total_pages, setTotalPages] = useState(-1)
	const [items, setItems] = useState<T[]>(defaultValue)
	const [reload, setReload] = useState(false)
	const fetcher = useFetcher()
	const location = useLocation()

	const handleLoadMore = () => {
		if (page <= total_pages) {
			fetcher.submit(
				{ page: page, per_page: perPage, ...params },
				{
					method: 'get',
					action: action,
				},
			)
			setPage(page + 1)
		}
	}
	const handleReload = () => {
		setReload(true)
		fetcher.submit(
			{ page: 1, per_page: (page >= 2 ? page - 1 : 1) * perPage, ...params },
			{
				method: 'get',
				action: action,
			},
		)
		if (page === -1) setPage(2)
	}
	useEffect(() => {
		handleReload()
	}, [location])

	useEffect(() => {
		if (fetcher.state === 'idle') {
			const newItems = getItems(fetcher)
			if (newItems) {
				if (newItems?.length && !reload) {
					setTotalPages(fetcher.data?.total_pages || 1)
					setItems(prev => [...prev, ...newItems])
				} else {
					if (total_pages === -1) setTotalPages(fetcher.data?.total_pages || 1)
					setReload(false)
					setItems(prev => [...newItems])
				}
			}
		}
	}, [fetcher])

	return {
		setItems,
		items,
		handleLoadMore,
		reload,
		handleReload,
		loading: fetcher.state !== 'idle',
		isLastPage: page > total_pages,
	}
}

export default usePageLoader
