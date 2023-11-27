import React, { useEffect, useRef, useState } from "react";
import { toxmaxlich, riomall } from "../consts";
import "./style.css";

export const MyMap = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

// toxmax lich nkari
  const topLeft = { lat: 40.157981372660885, lng: 44.520988836669886 };
  const bottomRight = { lat: 40.14575792720048, lng: 44.539621113691865 };

  // riomall nkari
  //  const topLeft = { lat: 40.20245128588071, lng: 44.50375361118862 };
  // const bottomRight = { lat: 40.20084825152563, lng: 44.50621287123156 };

  // const topLeft = {lat:riomall[0].lat, lng:riomall[0].lng}
  // const bottomRight = {lat:riomall[riomall.length-1].lat, lng:riomall[riomall.length-1].lng}

  // console.log(topLeft, bottomRight,"here");

  const imageSize = [619, 534];

  const [paths, setPaths] = useState([]);

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
    mapImage.src = "./lich.png";

    mapImage.onload = () => {
      context.drawImage(mapImage, 0, 0, imgWidth, imgHeight);

      // draw sample pointss
      toxmaxlich.forEach((point) => {
        const x = ((point.lng - lngMin) / (lngMax - lngMin)) * imgWidth;
        const y = ((point.lat - latMin) / (latMax - latMin)) * imgHeight;

        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
        context.closePath();

        setPaths([...paths, { x: x, y: y }]);
      });
      console.log(paths, "paths");
    };
  }, []);

  return (
    <div style={{ width: "619px", position: "relative" }}>
      <canvas ref={canvasRef} width={619} height={534} className="map-canvas" />
    </div>
  );
};
