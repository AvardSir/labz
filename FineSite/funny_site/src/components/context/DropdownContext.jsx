"use client"

import { createContext, useContext, useState } from "react"

const DropdownContext = createContext()

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownProvider")
  }
  return context
}

export const DropdownProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName))
  }

  const closeAllDropdowns = () => {
    setOpenDropdown(null)
  }

  const isOpen = (dropdownName) => {
    return openDropdown === dropdownName
  }

  return (
    <DropdownContext.Provider
      value={{
        openDropdown,
        toggleDropdown,
        closeAllDropdowns,
        isOpen,
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}
