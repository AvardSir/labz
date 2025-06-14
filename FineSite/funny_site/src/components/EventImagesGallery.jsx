"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createPortal } from "react-dom"

// Mock data для демонстрации
const MOCK_IMAGES = [
  "/placeholder.svg?height=400&width=600&text=Event+Image+1",
  "/placeholder.svg?height=400&width=600&text=Event+Image+2",
  "/placeholder.svg?height=400&width=600&text=Event+Image+3",
  "/placeholder.svg?height=400&width=600&text=Event+Image+4",
  "/placeholder.svg?height=400&width=600&text=Event+Image+5",
  "/placeholder.svg?height=400&width=600&text=Event+Image+6",
]

export const EventImagesGallery = ({ eventId, mockImages = MOCK_IMAGES }) => {
  const [images, setImages] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Refs для управления фокусом
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Пробуем загрузить с API
        const res = await fetch(`http://localhost:5000/api/events/${eventId}/images`)

        if (res.ok) {
          const files = await res.json()
          // Формируем полные URL для изображений
          const imageUrls = files.map((file) => `http://localhost:5000/uploads/${eventId}/${file}`)
          setImages(imageUrls)
        } else {
          throw new Error(`API returned ${res.status}`)
        }
      } catch (err) {
        console.warn("API не доступен, используем mock данные:", err)
        // Fallback на mock данные для демонстрации
        setImages(mockImages)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [eventId, mockImages])

  // Управление скроллом и фокусом при открытии/закрытии модального окна
  useEffect(() => {
    if (selectedIdx !== null) {
      // Сохраняем текущий активный элемент
      previousFocusRef.current = document.activeElement

      // Блокируем скролл
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"

      // Фокусируемся на модальном окне
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus()
        }
      }, 100)
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = ""
      document.body.style.touchAction = ""

      // Возвращаем фокус на предыдущий элемент
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [selectedIdx])

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return

      switch (e.key) {
        case "Escape":
          handleClose()
          break
        case "ArrowLeft":
          e.preventDefault()
          handlePrev()
          break
        case "ArrowRight":
          e.preventDefault()
          handleNext()
          break
        case "Tab":
          // Ограничиваем Tab только элементами внутри модального окна
          if (modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault()
                if (lastElement) lastElement.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault()
                if (firstElement) firstElement.focus()
              }
            }
          }
          break
      }
    }

    if (selectedIdx !== null) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedIdx, images.length])

  const handlePrev = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length)
    }
  }, [selectedIdx, images.length])

  const handleNext = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length)
    }
  }, [selectedIdx, images.length])

  const handleClose = useCallback(() => {
    setSelectedIdx(null)
  }, [])

  const handleImageClick = useCallback((idx) => {
    setSelectedIdx(idx)
  }, [])

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="images-gallery-loading">
        <div className="images-grid">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="image-skeleton" />
          ))}
        </div>
      </div>
    )
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="images-gallery-error">
        <p>Ошибка загрузки изображений</p>
        <small>{error}</small>
      </div>
    )
  }

  // Нет изображений
  if (images.length === 0) {
    return null // Не показываем ничего, если нет изображений
  }

  // Модальное окно
  const modal = selectedIdx !== null && (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр изображения"
      >
        {/* Основное изображение */}
        <img
          src={images[selectedIdx] || "/placeholder.svg"}
          alt={`Изображение мероприятия ${selectedIdx + 1} из ${images.length}`}
          className="modal-image"
          draggable={false}
        />

        {/* Кнопка закрытия */}
        <button onClick={handleClose} className="modal-close-btn" aria-label="Закрыть просмотр изображений">
          ×
        </button>

        {/* Навигация - показываем только если больше одного изображения */}
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} className="modal-nav-btn modal-prev-btn" aria-label="Предыдущее изображение">
              ‹
            </button>

            <button onClick={handleNext} className="modal-nav-btn modal-next-btn" aria-label="Следующее изображение">
              ›
            </button>
          </>
        )}

        {/* Индикатор позиции */}
        {images.length > 1 && (
          <div className="modal-counter">
            {selectedIdx + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="event-images-gallery">
      {/* Галерея миниатюр */}
      <div className="images-grid">
        {images.slice(0, Math.min(4, images.length)).map((imageUrl, idx) => (
          <div key={idx} className="image-wrapper" onClick={() => handleImageClick(idx)}>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Миниатюра изображения ${idx + 1}`}
              className="gallery-image"
              loading="lazy"
              draggable={false}
            />
            <div className="image-overlay">
              <span className="overlay-text">Просмотр</span>
            </div>
          </div>
        ))}

        {/* Показываем "+N" только если изображений больше 4 */}
        {images.length > 4 && (
          <div className="image-wrapper more-images" onClick={() => handleImageClick(0)}>
            <div className="more-images-placeholder">
              <span className="more-count">+{images.length - 4}</span>
            </div>
          </div>
        )}
      </div>

      {/* Рендерим модальное окно через портал */}
      {typeof window !== "undefined" && modal && createPortal(modal, document.body)}

      <style jsx>{`
        .event-images-gallery {
          margin: 10px 0;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-width: 100%;
        }

        .image-wrapper {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .image-wrapper:hover {
          transform: scale(1.05);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .image-wrapper:hover .image-overlay {
          background: rgba(0, 0, 0, 0.3);
        }

        .overlay-text {
          color: white;
          font-size: 12px;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .image-wrapper:hover .overlay-text {
          opacity: 1;
        }

        .more-overlay {
          background: rgba(0, 0, 0, 0.6);
        }

        .more-overlay .overlay-text {
          opacity: 1;
          font-size: 18px;
          font-weight: bold;
        }

        /* Состояния загрузки */
        .images-gallery-loading {
          margin: 10px 0;
        }

        .image-skeleton {
          aspect-ratio: 1;
          background: #f0f0f0;
          border-radius: 8px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .images-gallery-error {
          margin: 10px 0;
          padding: 10px;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
          text-align: center;
        }

        /* Модальное окно */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          outline: none;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .modal-close-btn:focus {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        .modal-nav-btn {
          position: absolute;
          top: 50%;
        
          width: 48px;
          height: 48px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Добавляем фиксированную позицию */
          will-change: background-color;
        }

        .modal-nav-btn:hover {
          background: rgba(0, 0, 0, 0.7);
          /* Убираем любые изменения позиции при hover */
        }

        .modal-prev-btn {
          left: 16px;
        }

        .modal-next-btn {
          right: 16px;
        }

        .modal-counter {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 14px;
          border-radius: 20px;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .images-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .modal-nav-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
          
          .modal-close-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }
        }

        .more-images-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .more-count {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
