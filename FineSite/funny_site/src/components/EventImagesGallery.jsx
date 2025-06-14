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

export const EventImagesGallery = ({ eventId, mockImages = MOCK_IMAGES, canEdit = false, onImagesUpdate }) => {
  const [images, setImages] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingImage, setDeletingImage] = useState(null)

  // Refs для управления фокусом и загрузки файлов
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  const fileInputRef = useRef(null)

  const loadImages = useCallback(async () => {
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

        // Уведомляем родительский компонент об обновлении
        if (onImagesUpdate) {
          onImagesUpdate(imageUrls)
        }
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
  }, [eventId, mockImages, onImagesUpdate])

  useEffect(() => {
    loadImages()
  }, [loadImages])

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
        case "Delete":
          if (canEdit) {
            e.preventDefault()
            handleDeleteImage(selectedIdx)
          }
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
  }, [selectedIdx, images.length, canEdit])

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

  // Обработка загрузки файлов
  const handleFileSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите файл изображения")
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не должен превышать 5MB")
        return
      }

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append("image", file)

        const response = await fetch(`http://localhost:5000/api/events/${eventId}/images`, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          // Перезагружаем список изображений
          await loadImages()
          alert("Изображение успешно загружено!")
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Ошибка загрузки")
        }
      } catch (err) {
        console.error("Ошибка загрузки изображения:", err)
        alert("Ошибка при загрузке изображения: " + err.message)
      } finally {
        setIsUploading(false)
        // Очищаем input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [eventId, loadImages],
  )

  // Обработка удаления изображения
  const handleDeleteImage = useCallback(
    async (imageIndex) => {
      if (!canEdit) return

      const imageUrl = images[imageIndex]
      if (!imageUrl) return

      // Извлекаем имя файла из URL
      const filename = imageUrl.split("/").pop()
      if (!filename) return

      const confirmDelete = window.confirm("Вы уверены, что хотите удалить это изображение?")
      if (!confirmDelete) return

      setDeletingImage(filename)

      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}/images/${filename}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Закрываем модальное окно если удаляем текущее изображение
          if (selectedIdx === imageIndex) {
            setSelectedIdx(null)
          } else if (selectedIdx > imageIndex) {
            // Корректируем индекс если удаляем изображение перед текущим
            setSelectedIdx(selectedIdx - 1)
          }

          // Перезагружаем список изображений
          await loadImages()
          alert("Изображение удалено!")
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Ошибка удаления")
        }
      } catch (err) {
        console.error("Ошибка удаления изображения:", err)
        alert("Ошибка при удалении изображения: " + err.message)
      } finally {
        setDeletingImage(null)
      }
    },
    [canEdit, images, eventId, selectedIdx, loadImages],
  )

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

        {/* Кнопка удаления - показываем только если можно редактировать */}
        {canEdit && (
          <button
            onClick={() => handleDeleteImage(selectedIdx)}
            disabled={deletingImage !== null}
            className="modal-delete-btn"
            aria-label="Удалить изображение"
          >
            {deletingImage === images[selectedIdx]?.split("/").pop() ? "Удаление..." : "🗑️"}
          </button>
        )}

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
      {/* Заголовок с кнопкой загрузки */}
      {canEdit && (
        <div className="gallery-header">
          <button
            onClick={handleFileSelect}
            disabled={isUploading}
            className="upload-btn"
            aria-label="Загрузить изображение"
          >
            {isUploading ? "Загрузка..." : "+ Добавить фото"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Галерея миниатюр */}
      {images.length > 0 ? (
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

              {/* Кнопка удаления на миниатюре */}
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteImage(idx)
                  }}
                  disabled={deletingImage !== null}
                  className="thumbnail-delete-btn"
                  aria-label="Удалить изображение"
                >
                  {deletingImage === imageUrl.split("/").pop() ? "..." : "×"}
                </button>
              )}
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
      ) : (
        <div className="no-images">
          <p>Нет изображений</p>
          {canEdit && <p className="no-images-hint">Нажмите "Добавить фото" чтобы загрузить первое изображение</p>}
        </div>
      )}

      {/* Рендерим модальное окно через портал */}
      {typeof window !== "undefined" && modal && createPortal(modal, document.body)}

      <style jsx>{`
        .event-images-gallery {
          margin: 10px 0;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .upload-btn {
          padding: 8px 16px;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .upload-btn:hover:not(:disabled) {
          background: #3182ce;
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .thumbnail-delete-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .image-wrapper:hover .thumbnail-delete-btn {
          opacity: 1;
        }

        .thumbnail-delete-btn:hover:not(:disabled) {
          background: rgba(220, 38, 38, 1);
          transform: scale(1.1);
        }

        .thumbnail-delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .no-images {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          background: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #ddd;
        }

        .no-images-hint {
          font-size: 14px;
          margin-top: 8px;
          color: #888;
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

        .modal-delete-btn {
          position: absolute;
          top: 16px;
          right: 70px;
          width: 40px;
          height: 40px;
          background: rgba(220, 38, 38, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-delete-btn:hover:not(:disabled) {
          background: rgba(220, 38, 38, 1);
        }

        .modal-delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-delete-btn:focus {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        .modal-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
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
          will-change: background-color;
        }

        .modal-nav-btn:hover {
          background: rgba(0, 0, 0, 0.7);
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
          
          .modal-close-btn, .modal-delete-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
          }

          .modal-delete-btn {
            right: 60px;
          }
        }
      `}</style>
    </div>
  )
}
