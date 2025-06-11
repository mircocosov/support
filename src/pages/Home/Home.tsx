import style from "./Home.module.scss"
import StatisticCard from "@/assets/components/base/StatisticCard"

export default function Home() {
	return (
		<main className={style.main}>
			<div className={style.statistic}>
				<StatisticCard
					text="Всего обращений"
					count={127}
					icon="ticket"
					svgColor="blue"
				/>
				<StatisticCard
					text="Открытые"
					count={23}
					icon="exclamationMark"
					svgColor="red"
				/>
				<StatisticCard
					text="В работе"
					count={8}
					icon="clock"
					svgColor="yellow"
				/>
				<StatisticCard
					text="Решенные"
					count={89}
					icon="checkMark"
					svgColor="green"
				/>
			</div>
		</main>
	)
}
