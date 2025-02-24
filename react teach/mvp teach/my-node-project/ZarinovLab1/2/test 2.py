import ffmpeg
import os

# Укажите абсолютный путь к вашему видеофайлу и выходной аудиофайл
video_file = r"C:\Users\Сократ\Documents\GitHub\AvardSir\react teach\mvp teach\my-node-project\ZarinovLab1\2\Elzin.mp4"
audio_file = r"C:\Users\Сократ\Documents\GitHub\AvardSir\react teach\mvp teach\my-node-project\ZarinovLab1\2\extracted_audio.mp3"

# Проверка существования файла
if os.path.exists(video_file):
    try:
        # Используем ffmpeg для извлечения аудио
        ffmpeg.input(video_file).output(audio_file).run()
        print("Аудиодорожка успешно извлечена и сохранена как", audio_file)
    except Exception as e:
        print(f"Ошибка при извлечении аудио: {e}")
else:
    print(f"Ошибка: видеофайл не найден по пути: {video_file}")
