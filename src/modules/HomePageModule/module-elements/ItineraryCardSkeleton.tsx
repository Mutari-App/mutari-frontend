import React from "react";

function ItineraryCardSkeleton() {
  return (
    <div className="flex flex-col w-1/5 min-w-40 border rounded-xl overflow-hidden transition-all hover:shadow-md font-raleway group animate-pulse">
      <div className="flex flex-col h-full">
        <div className="relative h-24 sm:h-40 w-full bg-gray-200 animate-pulse"></div>
        <div className="flex flex-col p-4 gap-2">
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between p-4"></div>
      </div>
    </div>
  )
}

export default ItineraryCardSkeleton;
