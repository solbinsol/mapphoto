import React, { useEffect, useState ,useRef } from "react";
import style from "./Header.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';


const Header = ({ imageFiles,onAreaClick,CCG,CCGS,CCGJ,reset}) => {
  const router = useRouter();
  const [seoulClicked, setSeoulClicked] = useState(false); // State to track if "서울" is clicked

  const [features, setFeatures] = useState([]); // 폴리곤 데이터를 상태로 관리

const seoulTextRef = useRef(null);

  
  // 각 이미지 박스마다 독립적인 상태를 가지도록 배열을 사용

  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [currentImageIndices, setCurrentImageIndices] = useState(
    imageFiles.length > 0 ? Array.from({ length: imageFiles.length }, () => 0) : []
  );



  useEffect(() => {

  
    // 이미지 파일이 추가되면 초기화
    if (imageFiles.length > 0) {
      setCurrentImageIndices(Array.from({ length: imageFiles.length }, () => 0));

      // 이미지 로드가 완료되면 imagesLoaded 상태를 true로 설정
      const imagePromises = imageFiles.map((item) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = item.imagePath;
          img.onload = resolve;
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
        });
    }
  }, [imageFiles]);
  // 특정 이미지 박스의 "다음" 버튼을 클릭할 때 다음 이미지로 이동하는 함수
  const handleNextClick = (index) => {
    setCurrentImageIndices((prevIndices) =>
      prevIndices.map((prevIndex, i) =>
        i === index ? (prevIndex + 1) % imageFiles.length : prevIndex
      )
    );
    console.log("Next - prevIndices:", currentImageIndices, "index:", index);
  };

  // 특정 이미지 박스의 "이전" 버튼을 클릭할 때 이전 이미지로 이동하는 함수
  const handlePrevClick = (index) => {
    setCurrentImageIndices((prevIndices) =>
      prevIndices.map((prevIndex, i) =>
        i === index
          ? prevIndex === 0
            ? imageFiles.length - 1
            : prevIndex - 1
          : prevIndex
      )
    );
    console.log("Prev - prevIndices:", currentImageIndices, "index:", index);
  };
  

  const handleSeoulClick = () => {
    setSeoulClicked(true);
    // 이후에 필요한 작업을 수행할 수 있습니다.
  };

  console.log("currentImageIndices:", currentImageIndices);
// handleNextClick 함수 내에 추가
// handlePrevClick 함수 내에 추가

const handleLogoClick = () => {
  router.reload(); // 현재 페이지를 다시 로드하여 새로고침합니다.
};
const [isGuideVisible, setIsGuideVisible] = useState(false); // 가이드 비디오의 가시성 상태를 관리

const toggleGuideVisibility = () => {
  setIsGuideVisible(!isGuideVisible);
};

  return (
    <div className={style.Header}>
      <div className={style.LogoBox}>
      <h1 className={style.Logo} onClick={handleLogoClick}>
          Map Photo
        </h1>      </div>
      {!imagesLoaded && (
        <div>
          <div className={style.MainHeader}>
            <h2 onClick={CCGS}>Seoul</h2>
            <h2 onClick={CCG}>Busan</h2>
            <h2 onClick={CCGJ}>Jeju</h2>
            <div className={style.GuideBox}>
              {/* 가이드 비디오의 가시성을 상태에 따라 표시 */}
              {isGuideVisible && (
                <video width="640" height="360"  controls autoPlay>
                  <source src="/Guid.mp4" type="video/mp4" />
                </video>
              )}
              <p className={style.Guide}  onClick={toggleGuideVisibility}>Guide</p>
              <p className={style.reset} onClick={reset}>reset</p>
            </div>
          </div>

          <div className={style.FootHeader}>
            
            <div className={style.FPB}>
              <p className={style.FP}>solbin project <span className={style.pjName}>MAP Photo</span> </p>
              <p className={style.StratDate}>2023-10-4 ~ ing </p>
              <Link href="https://github.com/solbinsol/mapphoto"><p className={style.Git}>https://github.com/solbinsol/mapphoto</p></Link>
            </div>
          </div>
        </div>
      )}
      {imageFiles.map((item, index) => (
        <div className={style.ImgBox} key={index}>
          {/* 선택한 지역의 이미지를 동적으로 렌더링 */}
          {item.date && <p className={style.date}> {item.date}</p>}

          <div>

            <img
              src={
                currentImageIndices[index] === index
                  ? item.imagePath2
                  : item.imagePath
              }
              alt={`Header Image ${index}`}
            />
                        <button
              className={style.PrevBtn}
              onClick={() => handlePrevClick(index)}
            >
              <img  src="img/lb.png"/>
            </button>
            <button
              className={style.NextBtn}
              onClick={() => handleNextClick(index)}
            >
              <img  src="img/lb.png"/>
            </button>
            {item.neighborhood && <p className={style.neighborhood}> {item.neighborhood}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Header;
