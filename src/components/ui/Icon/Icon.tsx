import style from './Icon.module.scss'
import classNames from 'classnames'
import { lazy } from 'react'

const Bell = lazy(() => import('@/assets/icons/bell.svg?react'))
const Chat = lazy(() => import('@/assets/icons/chat.svg?react'))
const Document = lazy(() => import('@/assets/icons/document.svg?react'))
const Download = lazy(() => import('@/assets/icons/download.svg?react'))
const Eye = lazy(() => import('@/assets/icons/eye.svg?react'))
const File = lazy(() => import('@/assets/icons/file.svg?react'))
const Logo = lazy(() => import('@/assets/icons/logo.svg?react'))
const paperclip = lazy(() => import('@/assets/icons/paperclip.svg?react'))
const Profile = lazy(() => import('@/assets/icons/profile.svg?react'))
const Tag = lazy(() => import('@/assets/icons/tag.svg?react'))
const Upload = lazy(() => import('@/assets/icons/upload.svg?react'))

const ICONS = {
  bell: {
    icon: Bell,
  },
  chat: {
    icon: Chat,
  },
  document: {
    icon: Document,
  },
  download: {
    icon: Download,
  },
  eye: {
    icon: Eye,
  },
  file: {
    icon: File,
  },
  logo: {
    icon: Logo,
  },
  paperclip: {
    icon: paperclip,
  },
  profile: {
    icon: Profile,
  },
  tag: {
    icon: Tag,
  },
  upload: {
    icon: Upload,
  },
}

interface Props {
  className?: string
  type?: 'primary' | 'white' | 'black' | 'blue'
  icon: keyof typeof ICONS
}

export default function Icon({ icon, className, type }: Props) {
  const IconComponent = ICONS[icon].icon

  return (
    <div className={classNames(style.container, type, className)}>
      <IconComponent />
    </div>
  )
}
