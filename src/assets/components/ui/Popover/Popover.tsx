import style from "./Select.module.scss"
import classNames from "classnames"
import { ReactNode } from "react"

interface Props {
	className?: string
	children?: ReactNode
}

export default function Popover({ className, children }: Props) {
	return (
		<div className={classNames(style.popover, className)} popover="">
			{children}
		</div>
	)
}
