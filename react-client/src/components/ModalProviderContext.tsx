"use client"

import type React from "react"
import { createContext, useContext } from "react"
import ModalManagerProvider from "./ModalManagerProvider"


// Create a context to check if the provider exists
const ModalProviderContext = createContext(false)

// Hook to check if the provider exists
export const useModalProviderExists = () => {
  return useContext(ModalProviderContext)
}

// Wrapper component that only adds the provider if it doesn't already exist
export const ModalProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const exists = useModalProviderExists()

  if (exists) {
    // Provider already exists up the tree, just render children
    return <>{children}</>
  }

  // Provider doesn't exist, add it
  return (
    <ModalProviderContext.Provider value={true}>
      <ModalManagerProvider>{children}</ModalManagerProvider>
    </ModalProviderContext.Provider>
  )
}

export default ModalProviderWrapper
