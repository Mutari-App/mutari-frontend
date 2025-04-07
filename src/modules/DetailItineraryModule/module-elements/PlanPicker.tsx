'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Layers, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export const PlanPicker = ({
  itineraryId,
  contingencies,
  selectedPlan,
}: {
  itineraryId: string
  contingencies: ContingencyPlan[]
  selectedPlan: Itinerary | ContingencyPlan
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="fixed py-7 px-2 space-x-0 left-0 bottom-5 bg-gradient-to-r from-[#004080] to-[#0073E6] text-white rounded-r-full min-w-16 h-10 flex items-center justify-center">
      {isOpen && (
        <div className="flex flex-row items-center justify-center gap-3 px-1">
          <Link href={`/itinerary/${itineraryId}`}>
            <div className="flex flex-col items-center justify-center font-raleway">
              <p className="text-[8px] leading-none">Plan</p>
              <p className="text-2xl leading-none">A</p>
              <div
                className={`w-1 h-1 rounded-full ${contingencies.some((contingency) => contingency.id == selectedPlan.id) ? 'bg-transparent' : 'bg-white'}`}
              />
            </div>
          </Link>
          {contingencies.map((contingency) => {
            const splitTitle = contingency.title.split(' ')
            return (
              <Link
                key={contingency.id}
                href={`/itinerary/${itineraryId}/contingency/${contingency.id}`}
              >
                <div className="flex flex-col items-center justify-center font-raleway">
                  <p className="text-[8px] leading-none">{splitTitle.at(0)}</p>
                  <p className="text-2xl leading-none">{splitTitle.at(1)}</p>
                  <div
                    className={`w-1 h-1 rounded-full ${selectedPlan.id === contingency.id ? 'bg-white' : 'bg-transparent'}`}
                  />
                </div>
              </Link>
            )
          })}
          {contingencies.length < 2 && (
            <Link href={`/itinerary/${itineraryId}/contingency/new`}>
              <div className="flex flex-col items-center justify-center font-raleway">
                <p className="text-[8px] leading-none">Add new plan</p>
                <p className="text-2xl leading-none">
                  <Plus />
                </p>
                <div className={`w-1 h-1 rounded-full bg-transparent`} />
              </div>
            </Link>
          )}
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none"
      >
        <Layers className="!w-[24px] !h-[24px]" strokeWidth={1} />
        {isOpen ? (
          <ChevronLeft className="!w-[24px] !h-[24px]" />
        ) : (
          <ChevronRight className="!w-[30px] !h-[24px]" />
        )}
      </Button>
    </div>
  )
}
