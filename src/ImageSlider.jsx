import { useState } from "react";
import "./ImageSlider.css"; // Add styles as needed

const images = [
  "/vite.svg", // Replace with your image URLs
  "/Search.svg", // Replace with your image URLs
  "/wifi.svg", // Replace with your image URLs
  "/Wishlist.svg", // Replace with your image URLs
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Helper to navigate images circularly
  const updateIndex = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0].clientX;
      const touch2 = e.touches[1].clientX;
      console.log("Two fingers detected:", touch1, touch2);
      setStartX(touch1);
    } else {
      console.log("Single finger detected");
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0].clientX;
      const touch2 = e.touches[1].clientX;
      console.log("Two fingers moving:", touch1, touch2);
      // Implement your sliding logic for two fingers
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  // Mouse Handlers
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const currentX = e.clientX;

      if (startX && Math.abs(currentX - startX) > 50) {
        if (currentX < startX) {
          // Swipe left
          updateIndex("right");
        } else {
          // Swipe right
          updateIndex("left");
        }
        setStartX(null); // Reset startX after swipe
      }
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setStartX(null);
  };

  return (
    <div
      className="slider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      //   onMouseDown={handleMouseDown}
      //   onMouseMove={handleMouseMove}
      //   onMouseUp={handleMouseUp}
      //   onMouseLeave={handleMouseUp} // Reset if mouse leaves slider area
    >
      <img src={images[currentIndex]} alt="slider" className="slider-image" />
    </div>
  );
};

export default ImageSlider;
