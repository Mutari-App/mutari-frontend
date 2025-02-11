import React from 'react'
import Form from 'next/form'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'

export const PreRegisterSection: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center md:py-4  text-blue-500">
      <Image
        src={getImage('pre-register-form-bg.webp')}
        fill
        className="object-cover object-center"
        alt="Form Background"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[#3C374450] " />
      <div className="flex flex-col items-center pb-8 relative">
        <h2 className="text-xl text-blue-800 md:text-3xl font-bold text-center mb-2 uppercase">
          Petualangan Baru Menanti!
        </h2>
        <span className="text-lg">Pra-registrasi sekarang, dapatkan (...)</span>

        <div className="my-8">
          <div className="grid grid-cols-5 py-6 px-6 bg-blue-100/30 text-blue-800 text-center rounded-xl backdrop-blur-sm border border-blue-200">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">99</span>
              <span>hari</span>
            </div>
            <span>:</span>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">10</span>
              <span>jam</span>
            </div>
            <span>:</span>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">45</span>
              <span>menit</span>
            </div>
          </div>
        </div>

        <span className="text-lg">
          999 pengguna telah melakukan praregistrasi
        </span>
      </div>

      <div className="w-full max-w-3xl mb-8 relative">
        <div className="bg-blue-100/30 backdrop-blur-sm border border-blue-200 text-blue-800 rounded-3xl py-6 px-16">
          <Form
            formMethod="POST"
            action="/"
            className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3"
          >
            <div className="text-sm">
              <label className="block mb-1" htmlFor="firstname">
                Nama Depan*
              </label>
              <input
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstname"
                type="text"
                placeholder="Masukkan nama depan"
              />
            </div>

            <div className="text-sm">
              <label className="block mb-1" htmlFor="lastname">
                Nama Akhir*
              </label>
              <input
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                type="text"
                placeholder="Masukkan nama akhir"
              />
            </div>

            <div className="text-sm">
              <label className="block mb-1" htmlFor="email">
                Email*
              </label>
              <input
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Masukkan alamat email"
              />
            </div>

            <div className="text-sm">
              <label className="block mb-1" htmlFor="phone">
                No. HP*
              </label>
              <input
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="text"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            {/* <div className="text-sm">
              <label className="block" htmlFor="country">
                Country*
              </label>
              <input className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Select your country"/>
            </div> */}

            <div className="text-sm">
              <label className="block mb-1" htmlFor="country">
                Negara*
              </label>
              <select
                id="countries"
                defaultValue="default"
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="default" disabled>
                  Pilih negara
                </option>
                {/* TODO ini masih blm pake API countries */}
                <option value="ID">Indonesia</option>
                <option value="SG">Singapore</option>
              </select>
            </div>

            <div className="text-sm">
              <label className="block mb-1" htmlFor="city">
                Kota*
              </label>
              <select
                id="city"
                defaultValue="default"
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="default" disabled>
                  Pilih kota
                </option>
                {/* TODO ini masih blm pake API countries */}
                <option value="US">Jakarta</option>
                <option value="CA">Depok</option>
                <option value="FR">Bandung</option>
                <option value="DE">Surabaya</option>
              </select>
            </div>

            <div className="text-sm col-span-2">
              <label className="block mb-1" htmlFor="refcode">
                Kode Referal
              </label>
              <input
                className="shadow appearance-none bg-blue-100 border border-blue-500 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="refcode"
                type="dropdown"
                placeholder="Masukkan kode referal (optional)"
              />
            </div>

            <div className="col-span-2 flex justify-center">
              <button
                className="px-4 py-3 bg-blue-100 border border-blue-500 text-blue-800 font-semibold rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Praregistrasi
              </button>
            </div>

            <div className="col-span-2 flex justify-center text-xs gap-1">
              <span className="">Sudah punya akun?</span>
              <a href="" className="underline font-semibold">
                Login
              </a>
            </div>
          </Form>
        </div>
      </div>
    </section>
  )
}
