import { type Dispatch, type ReactNode, type SetStateAction } from 'react'

export interface FormContextInterface {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  goToNextPage: () => void
  registerData: RegisterDataInterface
  setRegisterData: Dispatch<SetStateAction<RegisterDataInterface>>
}

export interface RegisterContextProviderProps {
  children: ReactNode
}

export interface RegisterDataInterface {
  firstName: string
  lastName?: string
  email: string
  birthDate?: Date
  uniqueCode: string
  password: string
  confirmPassword: string
}
