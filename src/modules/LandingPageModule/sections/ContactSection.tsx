import React from 'react'
import Image from 'next/image'
import { Instagram, Mail } from 'lucide-react'

export const ContactSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-12 md:py-16 px-4 text-white"
      style={{
        backgroundImage: 'url("/contact-background.png")',
      }}
    >
      <div className="absolute inset-0 bg-[#3C3744] opacity-50" />
      <div className="relative max-w-screen-xl mx-auto flex flex-col items-center">
        <div className="mb-6">
          <Image
            src="/logo-white.png"
            alt="Mutari Logo"
            width={1000}
            height={1000}
            className="object-contain w-20 md:w-24"
          />
        </div>
        <h2 className="text-xl md:text-3xl font-bold mb-4">CONTACT US</h2>
        <div className="flex flex-col items-center space-y-3">
          <a
            href="https://instagram.com/mutari.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>@mutari.id</span>
          </a>
          <a
            href="mailto:mutari.idn@gmail.com"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>mutari.idn@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  )
}
