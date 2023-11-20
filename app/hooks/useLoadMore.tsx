import { type Fetcher, useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'

type UseLoadMoreProps<T> = {
	perPage: number
	getItems?: (fetcher: Fetcher) => T[]
	action: string
	total_pages: number
	defaultValue?: T[]
	params?: object
	scrollViewRef?: React.RefObject<HTMLDivElement>
}

function useLoadMore<T>({
	perPage,
	getItems = (fetcher: Fetcher) => {
		return fetcher.data?.items
	},
	action,
	total_pages,
	params,
	scrollViewRef,
	defaultValue = [],
}: UseLoadMoreProps<T>) {
	const [page, setPage] = useState(1)
	const [items, setItems] = useState<T[]>(defaultValue)
	const [reload, setReload] = useState(false)
	const fetcher = useFetcher()

	const handleLoadMore = () => {
		if (page <= total_pages) {
			fetcher.submit(
				{ page: page + 1, per_page: perPage, ...params },
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
			{ page: 1, per_page: page * perPage, ...params },
			{
				method: 'get',
				action: action,
			},
		)
	}
	useEffect(() => {
		if (fetcher.state === 'idle') {
			const newItems = getItems(fetcher)
			if (newItems) {
				if (newItems?.length && !reload) {
					setItems(prev => [...prev, ...newItems])
				} else {
					setReload(false)
					setItems(prev => [...newItems])
				}
			}
		}
	}, [fetcher])
	useEffect(() => {
		if (scrollViewRef) {
			scrollViewRef.current?.scrollTo({ top: 0, behavior: 'instant' })
		}
		setPage(1)
		setItems(defaultValue)
	}, [defaultValue])

	return {
		setItems,
		items,
		handleLoadMore,
		handleReload,
		loading: fetcher.state !== 'idle',
		isLastPage: page >= total_pages,
	}
}

export default useLoadMore
