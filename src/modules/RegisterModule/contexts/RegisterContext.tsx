'use client'
import { createContext, useContext, useState } from 'react'
import {
  type FormContextInterface,
  type RegisterContextProviderProps,
  type RegisterDataInterface,
} from '../interface'

const RegisterContext = createContext({} as FormContextInterface)

export const useRegisterContext = () => useContext(RegisterContext)

export const RegisterContextProvider = ({
  children,
}: RegisterContextProviderProps) => {
  const [page, setPage] = useState<number>(0)
  const [registerData, setRegisterData] = useState<RegisterDataInterface>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: undefined,
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
    registerData,
    setRegisterData,
  }

  return (
    <RegisterContext.Provider value={contextValue}>
      {children}
    </RegisterContext.Provider>
  )
}
