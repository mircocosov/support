import style from "./Input.module.scss"
import classNames from "classnames"

export interface Props {
	placeholder?: string
	className?: string
	type?: "text" | "password" | "email"
	value?: string | number
}

export default function Input({ className, placeholder, type, value }: Props) {
	return (
		<input
			type={type}
			className={classNames(style.input, className)}
			placeholder={placeholder}
			value={value}
		/>
	)
}
