import { type Dispatch, type ReactNode, type SetStateAction } from 'react'

export interface FormContextInterface {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  goToNextPage: () => void
  resetPasswordData: ResetPasswordDataInterface
  setResetPasswordData: Dispatch<SetStateAction<ResetPasswordDataInterface>>
}

export interface ResetPasswordContextProviderProps {
  children: ReactNode
}

export interface ResetPasswordDataInterface {
  email: string
  uniqueCode: string
  password: string
  confirmPassword: string
}
