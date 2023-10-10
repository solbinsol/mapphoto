// pages/index.js
import Head from "next/head";
import { useEffect, useState ,useRef  } from "react";
import style from "./map.module.css";
import Header from "../Header/Header";

export default function Map({ latitude, longitude }) {
  const apiKey = "a32953360d2d9f9db8455072180a1a51";

  const [polygon, setPolygon] = useState(); // 폴리곤 객체 상태 추가
  const [features, setFeatures] = useState([]); // 폴리곤 데이터를 상태로 관리



  const [map, setMap] = useState(null); // 맵 상태 추가


  const [selectedArea, setSelectedArea] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentImageIndices, setCurrentImageIndices] = useState(
    imageFiles.length > 0 ? Array.from({ length: imageFiles.length }, () => 0) : []
  );


  const seoulTextRef = useRef(null); // 서울 텍스트 엘리먼트의 ref

  useEffect(() => {



    
    const script = document.createElement("script");
    // 이곳 script.async = true;
    script.async = false;

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(36.64150149957468 ,  128.02268619719845 ),
          level: 13,
        };
        const map = new window.kakao.maps.Map(container, options);



        const newMap = map;
        setMap(newMap); // 맵 상태 설정
        // JSON 파일을 읽어와 폴리곤 생성
        fetch('/sido.json')
          .then(response => response.json())
          .then(data => {
            const features = data.features;
            setFeatures(features); // features를 설정

            // 각 지역의 폴리곤을 생성 및 이벤트 핸들러 추가
            features.forEach(feature => {
              const polygonPath = feature.geometry.coordinates[0].map(coord => new window.kakao.maps.LatLng(coord[1], coord[0]));

              // 폴리곤 생성
              var polygon = new window.kakao.maps.Polygon({
                path: polygonPath,
                strokeWeight: 1,
                zIndex:0,
                strokeColor: feature.properties.CTP_ENG_NM === "Seoul" ? "black" : '#39DE2A',
                strokeOpacity: 0.8,
                fillColor: feature.properties.CTP_ENG_NM === "Seoul" ? "#FF0000" : "#A2FF99", // Change fillColor to red for Seoul
                fillOpacity: 0.5
              });

              feature.polygon = polygon;
              polygon.ctpEngNm = feature.properties.CTP_ENG_NM;

              polygon.setMap(map);

              window.kakao.maps.event.addListener(polygon, 'mouseover', function() {
                // 폴리곤 위에 마우스를 올렸을 때 처리할 코드
                const properties = feature.properties;
                console.log(`CTPRVN_CD: ${properties.CTPRVN_CD}`);
                console.log(`CTP_ENG_NM: ${properties.CTP_ENG_NM}`);
                console.log(`SIG_KOR_NM: ${properties.SIG_KOR_NM}`);

                // fillColor를 블랙으로 변경
                polygon.setOptions({
                  strokeWeight:2,
                  strokeColor: '#000000',
                  zIndex: 5, // 스트로크의 zIndex를 설정

                });
              });


              const mouseoutHandler = function () {
                const properties = feature.properties;

                  polygon.setOptions({
                    strokeWeight: 1,
                    strokeColor: '#39DE2A',
                  });
              };
              

              window.kakao.maps.event.addListener(polygon, 'mouseout', mouseoutHandler);

              //console.log(polygon);


              kakao.maps.event.addListener(map, 'zoom_changed', function() {
                const currentLevel = map.getLevel();
                if (currentLevel > 13) {
                  window.alert("최대 축소 상태입니다");
                  map.setLevel(13); // 레벨이 13보다 작으면 13으로 다시 설정
                  map.setCenter(new window.kakao.maps.LatLng(36.64150149957468, 128.02268619719845));

                }
              });


              // 폴리곤에 클릭 이벤트 핸들러 추가
              window.kakao.maps.event.addListener(polygon, 'click', function() {
                // 폴리곤 클릭 시 해당 지역 정보를 선택
                const properties = feature.properties;
                setSelectedArea(properties.CTP_ENG_NM);

                // 선택한 지역의 이미지 파일 목록을 설정
                const imageDir = properties.CTP_ENG_NM;
                getImagePathsForArea(imageDir);
              });

              // ... (이전 코드와 동일)
            });
          });
      });
    });

 
  

  }, []);

  const CCG = () => {
    console.log("Ss");
    // 변경할 폴리곤의 ctpEngNm 값을 설정
    const targetCtpEngNm = "busan"; // 대소문자 주의!
    
    // 모든 폴리곤을 순회하며 Busan인 경우에만 색상을 변경
    features.forEach(feature => {
      const properties = feature.properties;
      console.log("sssss");
      if (properties.CTP_ENG_NM.toLowerCase() === targetCtpEngNm) { // 대소문자 구분
        console.log("포문" + properties.CTP_ENG_NM);
    
        // 폴리곤의 fillColor를 변경
        const polygonToChange = feature.polygon; // 폴리곤 객체에 접근
        polygonToChange.setOptions({
          fillColor: "pink",
          strokeOpacity: 1,
          zIndex: 20,
          fillOpacity: 0.5,
          strokeColor: "black",
          strokeWeight: 3,
        });
    
        // 마우스 오버 및 마우스 아웃 이벤트 핸들러 제거
        kakao.maps.event.removeListener(polygonToChange, 'mouseover');
        kakao.maps.event.removeListener(polygonToChange, 'mouseout');
  
        console.log("이벤트 핸들러 제거됨"); // 확인을 위해 이 메시지를 추가
        
        if (map) {
          // 맵의 중심 좌표를 변경
          console.log("test")
          const targetLatLng = new kakao.maps.LatLng(35.2149682996739 ,  129.13233889499637 ); // 원하는 좌표로 설정
          map.setCenter(targetLatLng); // map은 지도 객체입니다.
          map.setLevel(11);
        }
      }
    });
  };

  const reset = () => {
    if (map) {
      // 초기 좌표로 이동
      map.setCenter(new window.kakao.maps.LatLng(36.64150149957468, 128.02268619719845));
      map.setLevel(13);
    }
  };
  


  const CCGS = () => {
    console.log("Ss");
    // 변경할 폴리곤의 ctpEngNm 값을 설정
    const targetCtpEngNm = "seoul"; // 대소문자 주의!
    
    // 모든 폴리곤을 순회하며 Busan인 경우에만 색상을 변경
    features.forEach(feature => {
      const properties = feature.properties;
      console.log("sssss");
      if (properties.CTP_ENG_NM.toLowerCase() === targetCtpEngNm) { // 대소문자 구분
        console.log("포문" + properties.CTP_ENG_NM);
    
        // 폴리곤의 fillColor를 변경
        const polygonToChange = feature.polygon; // 폴리곤 객체에 접근
        polygonToChange.setOptions({
          fillColor: "#ff0000",
          strokeOpacity: 1,
          zIndex: 20,
          fillOpacity: 0.5,
          strokeColor: "pink",
          strokeWeight: 3,
        });
    
        // 마우스 오버 및 마우스 아웃 이벤트 핸들러 제거
        kakao.maps.event.removeListener(polygonToChange, 'mouseover');
        kakao.maps.event.removeListener(polygonToChange, 'mouseout');
  
        console.log("이벤트 핸들러 제거됨"); // 확인을 위해 이 메시지를 추가
        
        if (map) {
          // 맵의 중심 좌표를 변경
          console.log("test")
          const targetLatLng = new kakao.maps.LatLng( 37.568437387277555 ,  126.98100621300533 ); // 원하는 좌표로 설정
          map.setCenter(targetLatLng); // map은 지도 객체입니다.
          map.setLevel(11);
        }
      }
    });
  };

  const CCGJ = () => {
    console.log("Ss");
    // 변경할 폴리곤의 ctpEngNm 값을 설정
    const targetCtpEngNm = "jeju-do"; // 대소문자 주의!
    
    // 모든 폴리곤을 순회하며 Busan인 경우에만 색상을 변경
    features.forEach(feature => {
      const properties = feature.properties;
      console.log("sssss");
      if (properties.CTP_ENG_NM.toLowerCase() === targetCtpEngNm) { // 대소문자 구분
        console.log("포문" + properties.CTP_ENG_NM);
    
        // 폴리곤의 fillColor를 변경
        const polygonToChange = feature.polygon; // 폴리곤 객체에 접근
        polygonToChange.setOptions({
          fillColor: "orange",
          strokeOpacity: 1,
          zIndex: 20,
          fillOpacity: 0.5,
          strokeColor: "red",
          strokeWeight: 2,
        });
    
        // 마우스 오버 및 마우스 아웃 이벤트 핸들러 제거
        kakao.maps.event.removeListener(polygonToChange, 'mouseover');
        kakao.maps.event.removeListener(polygonToChange, 'mouseout');
  
        console.log("이벤트 핸들러 제거됨"); // 확인을 위해 이 메시지를 추가
        
        if (map) {
          // 맵의 중심 좌표를 변경
          console.log("test")
          const targetLatLng = new kakao.maps.LatLng(  33.38514787749952 ,  126.56118210791432 ); // 원하는 좌표로 설정
          map.setCenter(targetLatLng); // map은 지도 객체입니다.
          map.setLevel(11);
        }
      }
    });
  };

  /*
  const CCG = () => {
    console.log("sds");
    if (polygon) {
      // 현재 폴리곤의 옵션을 가져옵니다.
      const currentStrokeWeight = polygon.strokeWeight;
      const currentStrokeColor = polygon.strokeColor;
      const currentStrokeOpacity = polygon.strokeOpacity;
      const currentFillColor = polygon.fillColor;
      const currentFillOpacity = polygon.fillOpacity;
  
      // 변경할 옵션 값을 설정합니다.
      const newFillColor = "blue"; // 변경하고자 하는 색상
  
      // 새로운 옵션을 적용하여 폴리곤을 업데이트합니다.
      polygon.setOptions({
        strokeWeight: currentStrokeWeight,
        strokeColor: currentStrokeColor,
        strokeOpacity: currentStrokeOpacity,
        fillColor: newFillColor,
        fillOpacity: currentFillOpacity,
      });
    }

    console.log("Polygon updated:", polygon.fillColor);

  };
  */
  
  
  // 선택한 지역에 대한 이미지 인덱스 배열을 반환하는 함수
const getImageIndicesForArea = (areaName) => {
  // imageFiles에서 해당 지역에 대한 이미지 파일들의 인덱스를 찾아서 반환
  const indices = imageFiles
    .map((item, index) => (item.area === areaName ? index : -1))
    .filter((index) => index !== -1);
  return indices;
};


// pages/index.js

// ...

const handleAreaClick = (areaName) => {
  setSelectedArea(areaName);

  // 이미지 인덱스 설정 및 이미지 로드
  setCurrentImageIndices(getImageIndicesForArea(areaName));

  // 각 폴리곤의 "CTP_ENG_NM"과 비교하여 폴리곤을 식별
  features.forEach(feature => {
    const properties = feature.properties;
    if (properties.CTP_ENG_NM === areaName) {
      // 폴리곤 색상 변경 등의 처리
      // ...

      seoulTextRef.current.style.color = "red"; // 빨간색으로 변경

    }
  });

  console.log(areaName);
};

// ...



  // 선택한 지역에 따라 해당 지역의 이미지 파일 목록을 가져오는 함수
  const getImagePathsForArea = (areaName) => {
    // JSON 파일에서 이미지 파일 경로를 읽어옴
    fetch('/imagePaths.json')
      .then(response => response.json())
      .then(imagePaths => {
        const imageList = imagePaths[areaName] || [];
        setImageFiles(imageList);
      })
      .catch(error => {
        console.error('Error loading imagePaths.json:', error);
        setImageFiles([]);
      });
  };

  return (
    <>
      <div className={style.MMM}>
        <div className={style.LeftHeader}>
          {/* 이미지 파일 목록을 헤더 컴포넌트로 전달 */}
          <Header imageFiles={imageFiles} selectedArea={selectedArea}  onAreaClick={handleAreaClick} CCG={CCG}
           CCGS={CCGS}
           CCGJ={CCGJ}
           reset={reset}/>
        </div>
        <div id="map" className={style.Map}></div>
        <div></div>


      </div>
    </>

  );
}
