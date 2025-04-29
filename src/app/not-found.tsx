import { Navbar } from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E5F1FF] to-white p-8">
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0073E6] to-[#80004B]">
          404
        </h1>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-800 text-center">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="mt-4 text-gray-600 text-center max-w-md">
          Maaf, halaman yang kamu cari tidak ditemukan
        </p>
      </div>
    </>
  )
}
