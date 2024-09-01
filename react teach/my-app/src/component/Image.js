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

class Image extends React.Component {
  render() {
    const { imageIndex } = this.props;
    const imagePath = imagePaths[imageIndex];
    
    return ( 
      <img 
        src={imagePath} // Используем src для изображения
        alt={`Cute Image ${imageIndex }`} // Корректный alt текст
        className="cute-image" 
      />
    );
  }
}

export default Image;
