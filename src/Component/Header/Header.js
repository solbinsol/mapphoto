import React, { useEffect, useState } from "react";
import style from "./Header.module.css";

const Header = ({ imageFiles }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // "다음" 버튼을 클릭할 때 다음 이미지로 이동하는 함수
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageFiles.length);
  };

  return (
    <div className={style.Header}>
      <div className={style.LogoBox}>
        <h1>LOGO</h1>
      </div>
      {imageFiles.map((item, index) => (
        <div className={style.ImgBox} key={index}>
          {/* 선택한 지역의 이미지를 동적으로 렌더링 */}
          <div>
            <button className={style.NextBtn} onClick={handleNextClick}>
              다음
            </button>
            <img
              src={currentImageIndex === index ? item.imagePath2 : item.imagePath}
              alt={`Header Image ${index}`}
            />
            {item.neighborhood && <p>Neighborhood: {item.neighborhood}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Header;
