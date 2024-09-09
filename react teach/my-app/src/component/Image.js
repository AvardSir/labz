import React from 'react';
import fun_cat_1 from '../img/fun_cat/fun_cat_1.jpg';
import fun_cat_2 from '../img/fun_cat/fun_cat_2.jpg';
import fun_cat_3 from '../img/fun_cat/fun_cat_3.jpg';
import fun_cat_4 from '../img/fun_cat/fun_cat_4.jpg';
import fun_cat_5 from '../img/fun_cat/fun_cat_5.jpg';
import fun_cat_6 from '../img/fun_cat/fun_cat_6.jpg';

const imagePaths = [
  fun_cat_1,
  fun_cat_2,
  fun_cat_3,
  fun_cat_4,
  fun_cat_5,
  fun_cat_6
];

class ImageGallery extends React.Component {
  render() {
    return (
      <div className='image-container'>
        {imagePaths.map((imagePath, index) => (
            

          <img 
            key={index} // Уникальный ключ для каждого элемента массива
            src={imagePath} // Используем src для изображения
            alt={`Cute Image ${index + 1}`} // Корректный alt текст
            className="cute-image" 
          />


        ))}

      </div>
    );
  }
}

export default ImageGallery;
