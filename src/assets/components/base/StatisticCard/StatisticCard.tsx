import style from "./StatisticCard.module.scss"
import Icon from "@/assets/components/ui/Icon"

export interface Props {
	text: string
	count: number
	icon: "ticket" | "exclamationMark" | "clock" | "checkMark"
	svgColor: "blue" | "red" | "green" | "yellow"
}

export default function StatisticCard({ text, count, icon, svgColor }: Props) {
	return (
		<div className={style.card}>
			<div className={style.content}>
				<p>{text}</p>
				<h2>{count}</h2>
			</div>
			<div className={style[svgColor]}>
				<Icon icon={icon} svgColor={svgColor} className={style.icon} />
			</div>
		</div>
	)
}
