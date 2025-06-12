"use client"

import { useEffect } from "react"
import { useDropdown } from "./context/DropdownContext"



// Компонент для закрытия dropdown'ов при клике вне их
export const ClickOutsideHandler = ({ children }) => {
  const { closeAllDropdowns } = useDropdown()

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что клик был не по dropdown элементам
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [closeAllDropdowns])

  return <>{children}</>
}
