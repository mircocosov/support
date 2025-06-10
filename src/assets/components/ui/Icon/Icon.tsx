import style from "./Icon.module.scss";
import classNames from "classnames";
import { lazy } from "react";

const Bell = lazy(() => import("@/assets/icons/bell.svg?react"));
const Calendar = lazy(() => import("@/assets/icons/calendar.svg?react"));
const CheckMark = lazy(() => import("@/assets/icons/check-mark.svg?react"));
const Clock = lazy(() => import("@/assets/icons/clock.svg?react"));
const Cross = lazy(() => import("@/assets/icons/cross.svg?react"));
const Download = lazy(() => import("@/assets/icons/download.svg?react"));
const Edit = lazy(() => import("@/assets/icons/edit.svg?react"));
const ExclamationMark = lazy(
	() => import("@/assets/icons/exclamation-mark.svg?react")
);
const Filter = lazy(() => import("@/assets/icons/filter.svg?react"));
const Headphones = lazy(() => import("@/assets/icons/headphones.svg?react"));
const Home = lazy(() => import("@/assets/icons/home.svg?react"));
const ILetter = lazy(() => import("@/assets/icons/i-letter.svg?react"));
const Key = lazy(() => import("@/assets/icons/key.svg?react"));
const Mail = lazy(() => import("@/assets/icons/mail.svg?react"));
const Minus = lazy(() => import("@/assets/icons/minus.svg?react"));
const Panel = lazy(() => import("@/assets/icons/panel.svg?react"));
const PaperClip = lazy(() => import("@/assets/icons/paper-clip.svg?react"));
const Paper = lazy(() => import("@/assets/icons/paper.svg?react"));
const Phone = lazy(() => import("@/assets/icons/phone.svg?react"));
const Plus = lazy(() => import("@/assets/icons/plus.svg?react"));
const Search = lazy(() => import("@/assets/icons/search.svg?react"));
const Settings = lazy(() => import("@/assets/icons/settings.svg?react"));
const Tag = lazy(() => import("@/assets/icons/tag.svg?react"));
const Ticket = lazy(() => import("@/assets/icons/ticket.svg?react"));
const Trash = lazy(() => import("@/assets/icons/trash.svg?react"));
const Upload = lazy(() => import("@/assets/icons/upload.svg?react"));
const UserPlus = lazy(() => import("@/assets/icons/user-plus.svg?react"));
const User = lazy(() => import("@/assets/icons/user.svg?react"));
const Warning = lazy(() => import("@/assets/icons/warning.svg?react"));

const ICONS = {
	bel: {
		icon: Bell,
	},
	calendar: {
		icon: Calendar,
	},
	checkMark: {
		icon: CheckMark,
	},
	clock: {
		icon: Clock,
	},
	cross: {
		icon: Cross,
	},
	download: {
		icon: Download,
	},
	edit: {
		icon: Edit,
	},
	exclamationMark: {
		icon: ExclamationMark,
	},
	filter: {
		icon: Filter,
	},
	headphones: {
		icon: Headphones,
	},
	home: {
		icon: Home,
	},
	iLetter: {
		icon: ILetter,
	},
	key: {
		icon: Key,
	},
	mail: {
		icon: Mail,
	},
	minus: {
		icon: Minus,
	},
	panel: {
		icon: Panel,
	},
	paper: {
		icon: Paper,
	},
	paperClip: {
		icon: PaperClip,
	},
	phone: {
		icon: Phone,
	},
	plus: {
		icon: Plus,
	},
	search: {
		icon: Search,
	},
	settings: {
		icon: Settings,
	},
	tag: {
		icon: Tag,
	},
	ticket: {
		icon: Ticket,
	},
	trash: {
		icon: Trash,
	},
	upload: {
		icon: Upload,
	},
	user: {
		icon: User,
	},
	userPlus: {
		icon: UserPlus,
	},
	warning: {
		icon: Warning,
	},
};

interface Props {
	className?: string;
	svgColor?: "white" | "orange";
	icon: keyof typeof ICONS;
}

export default function Icon({ icon, className, svgColor = "white" }: Props) {
	const IconComponent = ICONS[icon].icon;

	return (
		<div className={classNames(style.container, className)}>
			<IconComponent className={style[svgColor]} />
		</div>
	);
}
