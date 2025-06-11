import style from "./Input.module.scss"
import classNames from "classnames"
import { ReactNode } from "react"
import Button from "@/assets/components/ui/Button"
import Icon from "@/assets/components/ui/Icon"
import Popover from "@/assets/components/ui/Popover"

export type Props = {
	className?: string
	children?: ReactNode
}

export default function Notifications({ className, children }: Props) {
	return (
		<>
			<Button type="text">
				<Icon icon="bell" />
				<p>Уведомления</p>
			</Button>
			<Popover className={classNames(style.popover, className)}>
				{children}
			</Popover>
		</>
	)
}
