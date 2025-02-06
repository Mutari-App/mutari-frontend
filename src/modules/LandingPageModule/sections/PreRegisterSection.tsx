import React from 'react'
import Form from 'next/form'

export const PreRegisterSection: React.FC = () => {
  return (
    <section className='relative flex flex-col items-center md:py-4 mb-16 text-blue-500'>
      <div className='flex flex-col items-center pb-10'>
        <span className='text-[52px] font-semibold italic'>999,999,999</span>
        <span className='text-lg'>Pengguna telah pra-daftar ke Mutari</span>
      </div>

      <div className='w-full flex flex-col gap-3 max-w-3xl px-4'>
        <h2 className="text-xl md:text-3xl font-bold text-center mb-2">PRA-DAFTAR SEKARANG</h2>

        <div className='bg-blue-500 text-white rounded-lg py-6 px-6 w-full'>
          <Form formMethod="POST" action="/" className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3 w-full">
            <div className="text-sm">
              <label className="block" htmlFor="firstname">
                Nama Depan
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstname" type="text" placeholder=""/>
            </div>

            <div className="text-sm">
              <label className="block" htmlFor="lastname">
                Nama Akhir
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastname" type="text" placeholder=""/>
            </div>

            <div className="text-sm">
              <label className="block" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder=""/>
            </div>

            <div className="text-sm">
              <label className="block" htmlFor="phone">
                No. Telp
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder=""/>
            </div>

            <div className="text-sm">
              <label className="block" htmlFor="country">
                Negara
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder=""/>
            </div>

            <div className="text-sm">
              <label className="block" htmlFor="city">
                Kota
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="dropdown" placeholder=""/>
            </div>

            <div className="col-span-2 py-3 flex items-center">
              <button className="bg-blue-50 text-blue-500 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full max-w-xs" type="submit">
                Pra-Daftar
              </button>
            </div>
          </Form>

        </div>
      </div>
    </section>
  )
}
