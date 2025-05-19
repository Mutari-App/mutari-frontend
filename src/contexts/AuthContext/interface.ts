import { type ReactNode } from 'react'
import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export interface AuthContextProviderProps {
  children: ReactNode
  userResponse: UserResponseInterface | User | null
}

export interface AuthContextInterface {
  user: User | null
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  validate: (params: { ticket: string }) => Promise<ValidateResponse>
  login: (params: {
    email: string
    password: string
  }) => Promise<CustomFetchBaseResponse>
  preRegistLogin: (params: {
    email: string
  }) => Promise<CustomFetchBaseResponse>
  logout: () => Promise<CustomFetchBaseResponse>
  getMe: () => Promise<void>
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  photoProfile: string | null
  referralCode: string | null
  isEmailConfirmed: boolean
  referredById: string | null
  loyaltyPoints: number
  birthDate: string
  createdAt: string
  updatedAt: string
  usedCount: number
}

export interface UserResponseInterface {
  statusCode: number
  user: User | null
}

export interface ValidateResponse extends CustomFetchBaseResponse {
  email: string
  accessToken: string
}
