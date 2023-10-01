// pages/index.js
import Head from "next/head";
import { useEffect, useState } from "react";
import style from "./map.module.css";
import Header from "../Header/Header";

export default function Map({ latitude, longitude }) {
  const apiKey = "a32953360d2d9f9db8455072180a1a51";
  const [selectedArea, setSelectedArea] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.775730012459356, 127.63130734257706),
          level: 20,
        };
        const map = new window.kakao.maps.Map(container, options);

        // JSON 파일을 읽어와 폴리곤 생성
        fetch('/sido.json')
          .then(response => response.json())
          .then(data => {
            const features = data.features;

            // 각 지역의 폴리곤을 생성 및 이벤트 핸들러 추가
            features.forEach(feature => {
              const polygonPath = feature.geometry.coordinates[0].map(coord => new window.kakao.maps.LatLng(coord[1], coord[0]));

              // 폴리곤 생성
              var polygon = new window.kakao.maps.Polygon({
                path: polygonPath,
                strokeWeight: 1,
                strokeColor: '#39DE2A',
                strokeOpacity: 0.8,
                fillColor: '#A2FF99',
                fillOpacity: 0.5
              });

              polygon.setMap(map);

              window.kakao.maps.event.addListener(polygon, 'mouseover', function() {
                // 폴리곤 위에 마우스를 올렸을 때 처리할 코드
                const properties = feature.properties;
                console.log(`CTPRVN_CD: ${properties.CTPRVN_CD}`);
                console.log(`CTP_ENG_NM: ${properties.CTP_ENG_NM}`);
                console.log(`SIG_KOR_NM: ${properties.SIG_KOR_NM}`);

                // fillColor를 블랙으로 변경
                polygon.setOptions({
                  fillColor: '#000000',
                });
              });

              window.kakao.maps.event.addListener(polygon, 'mouseout', function() {
                // 폴리곤 위에서 마우스가 벗어났을 때 처리할 코드
                // fillColor를 원래대로 돌리는 코드
                polygon.setOptions({
                  fillColor: '#A2FF99',
                });
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
      <div>
        <div className={style.LeftHeader}>
          {/* 이미지 파일 목록을 헤더 컴포넌트로 전달 */}
          <Header imageFiles={imageFiles} />
        </div>
        <div id="map" className={style.Map}></div>
        <div></div>
      </div>
    </>
  );
}
