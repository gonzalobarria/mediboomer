import { Chicle, Work_Sans, Nunito } from "next/font/google"

const nunito = Nunito({ subsets: ["latin"], weight: "400" })

const chicle = Chicle({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-chicle",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-work-sans",
})

export const fonts = `${nunito.className}  ${chicle.variable} ${workSans.variable}`
