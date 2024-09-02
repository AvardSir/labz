import React,{useEffect, useState} from 'react';
const Button = ({ text = 'Кнопка' }) => {
    useEffect(()=>{
        document.title=`Вы нажали ${click} раз`
    })
    const [click,setClick]=useState(0)
    return (
      <button onClick={()=>setClick(click+1)}>{text} {'количество кликов'} {click}</button>
    );
  };

export default Button