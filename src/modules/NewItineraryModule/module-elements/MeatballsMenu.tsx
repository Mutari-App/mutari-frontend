'use client'
import React, { useState } from 'react'

export const MeatballsMenu: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const id = '0a6ec3ef-081b-40ae-b589-80d0716d69aa'

  const handleDelete = () => {
    setShowModal(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/itinerary/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to delete itinerary')
      }

      alert('Itinerary deleted successfully')
      setShowModal(false)
    } catch (error) {
      alert('Gagal menghapus itinerary. Silakan coba lagi.')
      console.error('Error deleting itinerary:', error)
    }
  }

  return (
    <div className="relative">
      <div className="w-48 bg-white shadow-md rounded-lg border border-gray-200 p-2 font-roboto font-semibold text-[#3C3744]">
        <ul className="text-sm">
          <li className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <button disabled>Invite</button>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <button disabled>Share</button>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <button disabled>Make public</button>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <button disabled>Mark as completed</button>
          </li>
          <li className="px-4 py-2 rounded-md hover:bg-red-100 text-[#B62116] cursor-pointer transition">
            <button onClick={handleDelete}>Delete</button>
          </li>
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center font-roboto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Apakah anda yakin?
            </h2>
            <p className="text-md mb-4">Anda ingin menghapus itinerary ini?</p>
            <div className="flex justify-center space-x-2">
              <button
                className="px-8 py-2 border-2 border-[#016CD7] bg-white rounded text-[#014285]"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="px-8 py-2 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center rounded"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeatballsMenu
