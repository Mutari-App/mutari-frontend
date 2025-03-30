import type { Metadata } from 'next'
import {
  Epilogue,
  Hammersmith_One,
  Poppins,
  Raleway,
  Roboto,
} from 'next/font/google'
import './../globals.css'
import { Suspense } from 'react'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { AuthContextProvider } from '@/contexts/AuthContext'
import useUserServer from '@/hooks/useUserServer'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-epilogue',
})

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const hammersmithOne = Hammersmith_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hammersmith-one',
})

export const metadata: Metadata = {
  title: {
    default: 'Mutari - Satu Aplikasi, Sejuta Destinasi, Bersama Mutari!',
    template: '%s - Mutari',
  },
  description:
    'Mutari adalah platform digital yang membantu wisatawan merencanakan perjalanan di Indonesia dengan itinerary otomatis, rekomendasi destinasi, dan kemudahan booking akomodasi serta transportasi.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userResponse = await useUserServer()
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </head>
      <body
        className={`${epilogue.variable} ${poppins.variable} ${raleway.variable} ${roboto.variable} ${hammersmithOne.variable} font-poppins overflow-x-hidden max-w-screen`}
      >
        <Suspense>
          <AuthContextProvider userResponse={userResponse}>
            <Navbar />
            <main className="w-full bg-white min-h-[80dvh]">{children}</main>
            <Toaster
              toastOptions={{
                classNames: {
                  error: 'bg-red-400',
                  success: 'text-green-400',
                  warning: 'text-yellow-400',
                  info: 'bg-blue-400',
                },
              }}
            />

            <Footer />
          </AuthContextProvider>
        </Suspense>
      </body>
    </html>
  )
}
