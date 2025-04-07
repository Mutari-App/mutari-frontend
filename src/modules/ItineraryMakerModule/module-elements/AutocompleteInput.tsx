'use client'

import { Input } from '@/components/ui/input'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { type Libraries, useLoadScript } from '@react-google-maps/api'
import { type Block } from '../interface'
import { useEffect, useRef, useState } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'

function AutocompleteInput({
  updateBlock,
  toggleInput,
  blockId,
  title,
  setPositionToView,
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
  setPositionToView: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}) {
  const [libraries] = useState<Libraries>(['places'])
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [optionsOpen, setOptionsOpen] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  })

  useOutsideClick({
    ref: suggestionsRef,
    handler: () => {
      setOptionsOpen(false)
      updateBlock(blockId, 'title', value)
    },
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
    initOnMount: isLoaded,
  })

  useEffect(() => {
    if (title) {
      setValue(title, false)
    }
  }, [title, setValue])

  const handleSelect = async (address: string, formattedValue: string) => {
    setValue(formattedValue, false)
    clearSuggestions()

    const results = await getGeocode({ address })
    const { lat, lng } = getLatLng(results[0])
    updateBlock(blockId, 'location', `${lat},${lng}`)
    toggleInput(blockId, 'location')
    updateBlock(blockId, 'title', formattedValue)
    setPositionToView({ lat, lng })
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className="w-full relative">
      <Input
        type="text"
        className="text-sm sm:text-base md:text-lg font-medium border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search Location..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOptionsOpen(true)
        }}
        disabled={!ready}
        data-testid='autocomplete-input'
      />
      {status === 'OK' && optionsOpen && (
        <div
          ref={suggestionsRef}
          className="absolute top-full w-full z-30 bg-white shadow-md border border-gray-200 rounded-md mt-1"
        >
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
