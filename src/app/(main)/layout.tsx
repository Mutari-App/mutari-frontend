import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
