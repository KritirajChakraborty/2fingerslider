import { useState, useRef, useEffect } from "react";
import "./ImageSlider.css"; // Add styles as needed

const images = [
  "/vite.svg", // Replace with your image URLs
  "/Search.svg", // Replace with your image URLs
  "/wifi.svg", // Replace with your image URLs
  "/Wishlist.svg", // Replace with your image URLs
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const sliderRef = useRef(null);

  const handleTouchStart = (e) => {
    console.log("Touch start - number of touches:", e.touches.length);

    if (e.touches.length === 2) {
      e.preventDefault();
      setIsSwiping(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const middleX = (touch1.clientX + touch2.clientX) / 2;
      setTouchStartX(middleX);
      console.log("Two finger touch detected at:", middleX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentX = (touch1.clientX + touch2.clientX) / 2;
      console.log("Two finger move at:", currentX);
    }
  };

  const handleTouchEnd = (e) => {
    console.log("Touch end - changed touches:", e.changedTouches.length);

    if (!isSwiping) return;

    if (e.changedTouches.length === 2) {
      const touch1 = e.changedTouches[0];
      const touch2 = e.changedTouches[1];
      const endX = (touch1.clientX + touch2.clientX) / 2;
      const diff = touchStartX - endX;

      console.log("Swipe difference:", diff);

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < images.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }
    }

    setIsSwiping(false);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Add event listeners with passive: false
    slider.addEventListener("touchstart", handleTouchStart, { passive: false });
    slider.addEventListener("touchmove", handleTouchMove, { passive: false });
    slider.addEventListener("touchend", handleTouchEnd);

    // Cleanup
    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]); // Re-add listeners if currentIndex changes

  return (
    <div className="slider-container">
      <div
        ref={sliderRef}
        className="slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="slide">
            <img src={src} alt={`Slide ${index + 1}`} draggable="false" />
          </div>
        ))}
      </div>

      <div className="dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <button
        className="nav-button prev"
        onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
      >
        ←
      </button>
      <button
        className="nav-button next"
        onClick={() =>
          currentIndex < images.length - 1 &&
          setCurrentIndex((prev) => prev + 1)
        }
      >
        →
      </button>
    </div>
  );
};

export default ImageSlider;
