'use client'
import { createContext, useContext, useState } from 'react'
import {
  type FormContextInterface,
  type ResetPasswordContextProviderProps,
  type ResetPasswordDataInterface,
} from '../interface'

const ResetPasswordContext = createContext({} as FormContextInterface)

export const useResetPasswordContext = () => useContext(ResetPasswordContext)

export const ResetPasswordContextProvider = ({
  children,
}: ResetPasswordContextProviderProps) => {
  const [page, setPage] = useState<number>(0)
  const [resetPasswordData, setResetPasswordData] =
    useState<ResetPasswordDataInterface>({
      email: '',
      uniqueCode: '',
      password: '',
      confirmPassword: '',
    })

  const goToNextPage = () => {
    setPage((prevState) => ++prevState)
  }

  const contextValue: FormContextInterface = {
    page,
    setPage,
    goToNextPage,
    resetPasswordData,
    setResetPasswordData,
  }

  return (
    <ResetPasswordContext.Provider value={contextValue}>
      {children}
    </ResetPasswordContext.Provider>
  )
}
