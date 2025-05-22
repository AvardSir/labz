import React, { useRef, useState } from 'react';

const AnecdoteAudioButton = ({ idAnecdote }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play().catch(handleError); // Обработка ошибок при воспроизведении
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setAudioError(true);
    setIsPlaying(false);
  };

  const audioSrc = `http://localhost:5000/audio/${idAnecdote}.mp3`;

  return (
    <div>
      {audioError ? (
        <div className="text-red-500 mt-2">
          😔 Пока нет озвучки. Напиши нам на <a href="mailto:voice@funnysite.local" className="underline">voice@funnysite.local</a>
        </div>
      ) : (
        <>
          <button onClick={toggleAudio} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
            {isPlaying ? '⏹️ Остановить' : `▶️ Слушать анекдот`}
          </button>
          <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={handleEnded}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
};

export default AnecdoteAudioButton;
