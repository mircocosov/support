import style from "./Input.module.scss"
import classNames from "classnames"

type Props = {
	className?: string
	src: string
	alt: string
}

export default function Image({ className, src, alt }: Props) {
	return (
		<img
			className={classNames(style.image, className)}
			src={src}
			alt={alt}
		/>
	)
}
