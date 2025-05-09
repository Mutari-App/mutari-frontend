import React from 'react'
import { Clock, Search, X } from 'lucide-react'

interface SearchHistoryDropdownProps {
  searchHistory: string[]
  suggestions: string[]
  onSelectItem: (query: string) => void
  onClearHistoryItem: (query: string) => void
  onClearAllHistory: () => void
  className?: string
}

const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  searchHistory,
  suggestions,
  onSelectItem,
  onClearHistoryItem,
  onClearAllHistory,
  className = '',
}) => {
  if (searchHistory.length === 0 && suggestions.length === 0) {
    return null
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg mt-1 overflow-hidden border border-gray-200 ${className}`}
    >
      {searchHistory.length > 0 && (
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Riwayat Pencarian
            </h3>
            <button
              onClick={onClearAllHistory}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Hapus Semua
            </button>
          </div>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={`history-${item}-${index}`} className="group">
                <div className="flex items-center justify-between p-2 rounded">
                  <button
                    className="flex items-center gap-2 flex-1 min-w-0 text-left hover:bg-gray-100 w-full p-1 rounded"
                    onClick={() => onSelectItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelectItem(item)
                      }
                    }}
                  >
                    <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span
                      className="text-sm text-gray-700 truncate"
                      title={item}
                    >
                      {item}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onClearHistoryItem(item)
                    }}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0 ml-2 p-1"
                    aria-label={`Remove ${item} from search history`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="p-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Saran Pencarian
          </h3>
          <ul>
            {suggestions.map((item, index) => (
              <li key={`suggestion-${item}-${index}`} className="group">
                <button
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer w-full text-left"
                  onClick={() => onSelectItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectItem(item)
                    }
                  }}
                >
                  <Search className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate" title={item}>
                    {item}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchHistoryDropdown
