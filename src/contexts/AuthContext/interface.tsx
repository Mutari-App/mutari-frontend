import { ReactNode } from 'react'

export interface AuthContextProviderProps {
  children: ReactNode
  user: User | null
}

export interface AuthContextInterface {
  user: User | null
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>

  validate: ({ ticket }: { ticket: string }) => Promise<any>
  login: ({ email }: { email: string }) => Promise<any>
}

export interface User {
  email: string
  referralCode: string
  usedCount: number
}

export interface UserResponseInterface extends User {
  code: number
  success: boolean
  message: string
}

export interface LoginResponse extends CustomFetchBaseResponse {
  accessToken: string
  user: User
}
