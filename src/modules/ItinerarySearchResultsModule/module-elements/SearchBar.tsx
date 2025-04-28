import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SearchHistoryDropdown from './SearchHistoryDropdown'
import { customFetch } from '@/utils/newCustomFetch'

interface SearchBarProps {
  initialValue: string
  onSearch: (query: string) => void
  className?: string
  searchHistoryDropdownPadding?: string
}

const SEARCH_HISTORY_KEY = 'itinerary-search-history'
const MAX_HISTORY_ITEMS = 5

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue,
  onSearch,
  className = '',
  searchHistoryDropdownPadding = '',
}) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update inputValue when initialValue changes (e.g., when reset is clicked)
  useEffect(() => {
    setInputValue(initialValue)
    // Also clear suggestions when initialValue changes
    setSuggestions([])
  }, [initialValue])

  // Load search history from localStorage on component mount
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (history) {
      setSearchHistory(JSON.parse(history) as string[])
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch suggestions when input value changes
  useEffect(() => {
    // Always clear suggestions when input is less than 2 characters
    if (!isFocused || inputValue.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const response = await customFetch<{ suggestions: string[] }>(
          `/itineraries/suggestions?q=${inputValue}`,
          { method: 'GET' }
        )
        setSuggestions(response.suggestions || [])
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setSuggestions([])
      }
    }

    const timer = setTimeout(() => {
      void fetchSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, isFocused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addToSearchHistory(inputValue)
      onSearch(inputValue)
      setIsFocused(false)
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  const handleSelectItem = (query: string) => {
    setInputValue(query)
    addToSearchHistory(query)
    onSearch(query)
    setIsFocused(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleClearInput = () => {
    setInputValue('')
    // Explicitly clear suggestions when input is cleared
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const addToSearchHistory = (query: string) => {
    if (query.trim() === '') return

    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, MAX_HISTORY_ITEMS)

    setSearchHistory(newHistory)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
  }

  const handleClearHistoryItem = (query: string) => {
    const newHistory = searchHistory.filter((item) => item !== query)
    setSearchHistory(newHistory)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
  }

  const handleClearAllHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  return (
    <div className={`relative flex w-full max-w-lg items-center ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Cari Rencana Perjalanan..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pr-[106px] rounded-full opacity-70 text-[13px]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-[2.5px]">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearInput}
              className="mr-1 h-8 w-8 hover:bg-transparent text-gray-800 hover:text-black"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="text-white hover:text-white w-12 sm:w-16 rounded-full bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] flex items-center justify-center"
          >
            <Search className="h-4 sm:h-5 w-4 sm:w-5" />
          </Button>
        </div>
      </form>
      {isFocused && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-10 mt-1"
        >
          <SearchHistoryDropdown
            searchHistory={searchHistory}
            suggestions={suggestions}
            onSelectItem={handleSelectItem}
            onClearHistoryItem={handleClearHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            className={`${searchHistoryDropdownPadding}`}
          />
        </div>
      )}
    </div>
  )
}

export default SearchBar
