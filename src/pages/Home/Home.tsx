import style from './Home.module.scss'
import Input from '@/components/Input'

export default function Home() {
  return (
    <main className={style.main}>
      <div>
        <Input></Input>
      </div>
    </main>
  )
}
