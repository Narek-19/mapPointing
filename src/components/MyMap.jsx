import React, { useEffect, useRef, useState } from "react";
import { hikingPath } from "../consts";
import "./style.css";
import { point } from "leaflet";

export const MyMap = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // toxmax lich nkari
  const topLeft = { lat: 39.38724679757667, lng: 46.19287935950184 };
  const bottomRight = { lat: 39.26481533703087, lng: 46.44075839370408 };

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
    mapImage.src = "./hikingPathArmenia.png";

    mapImage.onload = () => {
      console.log("here");
      const points = [];
      context.drawImage(mapImage, 0, 0, imgWidth, imgHeight);

      // draw sample pointss
      hikingPath.forEach((point) => {
        const x = ((point.lng - lngMin) / (lngMax - lngMin)) * imgWidth;
        const y = ((point.lat - latMin) / (latMax - latMin)) * imgHeight;
        points.push({ x, y });
        // setPaths([...paths, { x: x, y: y }]);

        context.beginPath();
        context.arc(x, y, 6, 0, 2 * Math.PI);
        context.fillStyle = "green";
        context.fill();
        context.closePath();
      });
      console.log(points, "points");

      for (let i = 0; i < points.length; i++) {
        context.lineWidth = 3;
        context.beginPath();
        context.setLineDash([8, 9]);
        context.moveTo(points[i].x, points[i].y);
        if (i !== points.length - 1) {
          context.lineTo(points[i + 1].x, points[i + 1].y);
          context.strokeStyle = "orange";
          context.stroke();
        }
      }
    };
  }, []);

  console.log(paths, "paths");

  return (
    <div style={{ width: "619px", position: "relative" }}>
      <canvas ref={canvasRef} width={619} height={534} className="map-canvas" />
    </div>
  );
};
