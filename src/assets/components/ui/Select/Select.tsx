import style from "./Select.module.scss"
import classNames from "classnames"
import { ReactNode } from "react"

type Props = {
	className?: string
	children?: ReactNode
}

export default function Select({ className, children }: Props) {
	return (
		<select className={classNames(style.select, className)}>
			{children}
		</select>
	)
}
