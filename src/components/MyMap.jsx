import React, { useEffect, useRef, useState } from "react";
import { kml } from "@tmcw/togeojson";
import "./style.css";

export const MyMap = () => {
  const [geoJson, setGeoJson] = useState();
  // const [kmlFile,setKmlFile] = useState();

  // const fileUploader = useRef();

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

// console.log(kmlFile,"kml file");
  // toxmax lich nkari
  const topLeft = { lat: 39.38724679757667, lng: 46.19287935950184 };
  const bottomRight = { lat: 39.26481533703087, lng: 46.44075839370408 };

  // const fileChange =(event)=>{
  //   event.stopPropagation();
  //   event.preventDefault();
  //   console.log(event.target.files,"target");
  //   const file = event.target.files[0];
  //   console.log(file);
  //   setKmlFile(file);
  // }


  // const handleUploadFile = (e) => {
  //   fileUploader.current.click();
  // };


  const imageSize = [619, 534];

  const fetchGeoData = async () => {
    const response = await fetch("http://localhost:3000/mix1.geojson");
    const data = await response.json();
    setGeoJson(data);
  };

  useEffect(() => {
    fetchGeoData();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const [latMin, lngMin, latMax, lngMax] = [
      topLeft.lat,
      topLeft.lng,
      bottomRight.lat,
      bottomRight.lng,
    ];
    const [imgWidth, imgHeight] = imageSize;

    // draw map image
    const mapImage = new Image();
    mapImage.src = "./hikingPathArmenia.png";

    mapImage.onload = () => {
      console.log("here");
      const points = [];
      context.drawImage(mapImage, 0, 0, imgWidth, imgHeight);

      console.log({hassData:Boolean(geoJson),geoJson},"geoJson");
      
      if(geoJson){
        // debugger
        if(geoJson.type === "FeatureCollection"){
          geoJson.features.forEach((el)=>{
           if(el.geometry.type === "Point"){
            const lat = el.geometry.coordinates[0];
            const lng = el.geometry.coordinates[1];
            const x = ((lng - lngMin) / (lngMax - lngMin)) * imgWidth;
            const y = ((lat - latMin) / (latMax - latMin)) * imgHeight;
              points.push({ x, y, type:"Point" });
           }else if(el.geometry.type === "LineString"){
              el.geometry.coordinates.map((el)=>{
                const lat = el[0];
                const lng = el[1];
                const x = ((lng - lngMin) / (lngMax - lngMin)) * imgWidth;
                const y = ((lat - latMin) / (latMax - latMin)) * imgHeight;
                  points.push({ x, y, type:"LineString" });
              })
           }
          })
        }
      }
      // ------------------------------------------------
      console.log(points,"here points")
      points.forEach((point) => {
        if(point.type === "Point"){
          context.beginPath();
          context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
          context.fillStyle = "green";
          context.fill();
          context.closePath();
        }
      });

      for (let i = 0; i < points.length; i++) {
        context.lineWidth = 3;
        context.beginPath();
        context.setLineDash([5, 9]);
        context.moveTo(points[i].x, points[i].y);
        if (i !== points.length - 1) {
          context.lineTo(points[i + 1].x, points[i + 1].y);
          context.strokeStyle = "orange";
          context.stroke();
        }
      }
    };
  }, [geoJson]);


  return (
    <div style={{ width: "619px", position: "relative" }}>
     
      {/* <input style={{ display: "none" }} ref={fileUploader} type="file" onChange={fileChange}/> */}
      <canvas ref={canvasRef} width={619} height={534} className="map-canvas" />
       {/* <button onClick ={handleUploadFile}>Upload File</button> */}
    </div>
  );
};
