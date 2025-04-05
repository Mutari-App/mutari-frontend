'use client'

import { Input } from '@/components/ui/input'
import { type Libraries, useLoadScript } from '@react-google-maps/api'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { type Block } from '../interface'
import { useEffect } from 'react'

function AutocompleteInput({
  updateBlock,
  toggleInput,
  blockId,
  title,
}: {
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  toggleInput: (
    blockId: string,
    inputType: 'time' | 'price' | 'location'
  ) => void
  blockId: string
  title: string
}) {
  const libraries: Libraries = ['places']

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: libraries,
  })

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'id' },
      types: ['establishment'],
    },
  })

  useEffect(() => {
    if (title) {
      setValue(title, false)
    }
  }, [title, setValue])

  const handleSelect = async (address: string, formattedValue: string) => {
    console.log('🧠 handleSelect called with', address, formattedValue)

    setValue(formattedValue, false)
    clearSuggestions()

    const results = await getGeocode({ address })
    const { lat, lng } = getLatLng(results[0])
    console.log('✅ Calling updateBlock with location')
    updateBlock(blockId, 'location', `${lat},${lng}`)
    toggleInput(blockId, 'location')
    updateBlock(blockId, 'title', formattedValue)
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className="w-full relative">
      <Input
        type="text"
        className="text-sm sm:text-base md:text-lg font-medium border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search Location..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
      />
      {status === 'OK' && (
        <div className="absolute top-full w-full z-30 bg-white shadow-md border border-gray-200 rounded-md mt-1">
          {data.map(({ place_id, structured_formatting, description }) => (
            <div
              key={place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() =>
                handleSelect(description, structured_formatting.main_text)
              }
            >
              {structured_formatting.main_text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AutocompleteInput
