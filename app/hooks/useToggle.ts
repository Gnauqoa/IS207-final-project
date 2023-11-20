import { useState } from 'react'

const useToggle = ({ defaultValue = false }: { defaultValue?: boolean }) => {
	const [toggle, setToggle] = useState<boolean>(defaultValue)
	const handleToggle = () => {
		setToggle(!toggle)
	}
	const handleOpen = () => {
		setToggle(true)
	}
	const handleClose = () => {
		setToggle(false)
	}

	return { toggle, handleToggle, handleOpen, handleClose }
}
export default useToggle
