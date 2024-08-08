import { config } from "@/config"
import { cookieToInitialState } from "@account-kit/core"
import type { Metadata } from "next"
import { headers } from "next/headers"
import "./globals.css"
import { Providers } from "./providers"
import SideBar from "@/components/layouts/sideBar"
import TopNav from "@/components/layouts/topNav"
import { fonts } from "@/lib/fontApp"
import MediBoomerProvider from "@/components/web3/context/mediBoomerContext"

export const metadata: Metadata = {
  title: "MediBoomer",
  description: "Safe a life",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  )

  return (
    <html lang="en">
      <body className={`${fonts} relative h-screen`}>
        <Providers initialState={initialState}>
          <MediBoomerProvider>
            <div className="flex w-full flex-col bg-muted/40">
              <SideBar />
              <div className="flex flex-col sm:pl-14">
                <TopNav />
                <main>{children}</main>
              </div>
            </div>
          </MediBoomerProvider>
        </Providers>
      </body>
    </html>
  )
}
