import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import ConnectButton from "../web3/connectButton"

const HeaderSection = () => {
  return (
    <>
      <Breadcrumb className=" md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">MediBoomer</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
const TopNav = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 justify-between">
      <HeaderSection />
      <ConnectButton />
    </header>
  )
}

export default TopNav
