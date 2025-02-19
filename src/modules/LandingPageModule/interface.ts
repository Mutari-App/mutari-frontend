import { type User } from '@/contexts/AuthContext/interface'
import React, { type Dispatch, type SetStateAction } from 'react'

export interface LoginFormProps {
  isSuccess: boolean
  setIsSuccess: Dispatch<SetStateAction<boolean>>
  showRegisterForm: () => void
  email: string
  setEmail: Dispatch<SetStateAction<string>>
}

export interface PreRegisterFormProps {
  isSuccess: boolean
  setIsSuccess: Dispatch<SetStateAction<boolean>>
  showLoginForm: () => void
  email: string
  setEmail: Dispatch<SetStateAction<string>>
}
export interface ReferralCodeProps {
  user: User
}

export interface PreRegisterCountResponse {
  count: number
}

export interface PreRegisterSectionProps {
  count: number
}

export interface GetCountriesResponse {
  countries: CountryProps[]
}

export interface GetCitiesResponse {
  cities: CityProps[]
}

export interface GetCountryCode {
  country: { name: string; code: string }
}

export interface CountryProps {
  id: string
  name: string
}

export interface CityProps {
  id: string
  name: string
}

export interface PreRegisterResponse {
  user: {
    updatedAt: string
    createdAt: string
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    referralCode: string
    referredById: string
  }
}
export interface FeatureCardProps {
  title: string
  description: string
  iconURL: string
}

export interface CapabilityItemProps {
  icon: React.ReactNode
  title: string
  desc: string
}
