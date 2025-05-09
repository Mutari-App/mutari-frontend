'use client'

export const TourOrderCard = ({
  pricePerTicket,
}: {
  pricePerTicket: number
}) => {
  return (
    <div className="sticky top-4 w-full lg:w-72 bg-white p-4 rounded-xl shadow-md self-start">
      <p className="text-xl font-semibold text-gray-800 text-raleway">
        Rp{pricePerTicket}
        <span className="text-sm"> / pax</span>
      </p>
      <button className="mt-4 w-full bg-gradient-to-r from-[#016CD7] to-[#014285] text-white py-2 rounded-lg">
        Pesan Sekarang
      </button>
    </div>
  )
}
