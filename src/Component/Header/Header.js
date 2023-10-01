// Header.js
import React, { useEffect, useState } from "react";
import style from "./Header.module.css";

const Header = ({ imageFiles }) => {
  return (
    <div className={style.Header}>
      <div className={style.LogoBox}>
        <h1>LOGO</h1>
      </div>
      {imageFiles.map((item, index) => (

      <div className={style.ImgBox}>
        {/* 선택한 지역의 이미지를 동적으로 렌더링 */}
          <div key={index}>
            <img src={`${item.imagePath}`} alt={`Header Image ${index}`} />
            {item.neighborhood && <p>Neighborhood: {item.neighborhood}</p>}
          </div>
      </div>
        ))}

    </div>
  );
};

export default Header;
