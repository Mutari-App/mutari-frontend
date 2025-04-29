'use client'
import { Input } from '@/components/ui/input'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { type Block } from '../interface'
import { useEffect, useRef, useState } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'
import { APIProvider } from '@vis.gl/react-google-maps'
import { Edit2 } from 'lucide-react'

function AutocompleteInput({
  updateBlock,
  blockId,
  title,
  setPositionToView,
}: {
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  blockId: string
  title: string
  setPositionToView: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}) {
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
    initOnMount: isApiLoaded,
  })

  useOutsideClick({
    ref: suggestionsRef,
    handler: () => {
      setOptionsOpen(false)
      updateBlock(blockId, 'title', value)
    },
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
    updateBlock(blockId, 'title', formattedValue)
    setPositionToView({ lat, lng })
    setOptionsOpen(false)
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value === 'Masukkan Lokasi') {
      e.target.select()
    }
  }

  return (
    <APIProvider
      onLoad={() => setIsApiLoaded(true)}
      libraries={['places']}
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}
    >
      <div
        className="w-full relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center w-full">
          <Input
            ref={inputRef}
            type="text"
            className="text-sm sm:text-base lg:text-lg font-medium border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search Location..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setOptionsOpen(true)
            }}
            onFocus={handleInputFocus}
            disabled={!ready}
            data-testid="autocomplete-input"
            style={{ cursor: ready ? 'text' : 'wait' }}
          />
          {isHovered && (
            <Edit2
              size={16}
              className="text-gray-400 absolute right-2 transition-opacity duration-200"
            />
          )}
        </div>
        {optionsOpen && (
          <div
            ref={suggestionsRef}
            className="absolute top-full w-full z-30 bg-white shadow-md border border-gray-200 rounded-md mt-1"
          >
            {status !== 'OK' ? (
              <div className="p-2 text-sm text-gray-400">Mencari Lokasi...</div>
            ) : status === 'OK' ? (

              data.map(({ place_id, structured_formatting, description }) => (
                <div
                  key={place_id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() =>
                    handleSelect(description, structured_formatting.main_text)
                  }
                >
                  {structured_formatting.main_text}
                </div>
              ))
            ) : null}
          </div>
        )}
      </div>
    </APIProvider>
  )
}

export default AutocompleteInput
