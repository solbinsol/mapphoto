import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import KakaoMap from '@/Component/KakaoMap/KaKaoMap'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={styles.MainPage}>
      <div className={styles.Map}>
        <KakaoMap></KakaoMap>
      </div>
    </div>
  )
}
