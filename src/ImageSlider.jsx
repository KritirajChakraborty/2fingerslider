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
  const [touchStartX, setTouchStartX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchPoints, setTouchPoints] = useState(new Set());
  const sliderRef = useRef(null);

  const handleTouchStart = (e) => {
    // Track each touch point
    const newTouchPoints = new Set(touchPoints);
    for (let i = 0; i < e.changedTouches.length; i++) {
      newTouchPoints.add(e.changedTouches[i].identifier);
    }
    setTouchPoints(newTouchPoints);

    console.log("Touch points after start:", newTouchPoints.size);

    // Only initiate swipe if exactly two fingers are used
    if (newTouchPoints.size === 2) {
      e.preventDefault();
      setIsSwiping(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const middleX = (touch1.clientX + touch2.clientX) / 2;
      setTouchStartX(middleX);
      console.log("Two finger touch started at:", middleX);
    }
  };

  const handleTouchMove = (e) => {
    if (touchPoints.size === 2 && isSwiping) {
      e.preventDefault();
      console.log("Two finger move detected");
    }
  };

  const handleTouchEnd = (e) => {
    // Remove ended touch points
    const newTouchPoints = new Set(touchPoints);
    for (let i = 0; i < e.changedTouches.length; i++) {
      newTouchPoints.delete(e.changedTouches[i].identifier);
    }
    setTouchPoints(newTouchPoints);

    console.log("Touch points after end:", newTouchPoints.size);

    if (isSwiping && touchStartX !== null && e.changedTouches.length > 0) {
      const touch1 = e.changedTouches[0];
      const touch2 = e.changedTouches[1];

      if (touch1 && touch2) {
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
    }

    // Reset if all touches have ended
    if (newTouchPoints.size === 0) {
      setIsSwiping(false);
      setTouchStartX(null);
    }
  };

  const handleTouchCancel = (e) => {
    setTouchPoints(new Set());
    setIsSwiping(false);
    setTouchStartX(null);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("touchstart", handleTouchStart, { passive: false });
    slider.addEventListener("touchmove", handleTouchMove, { passive: false });
    slider.addEventListener("touchend", handleTouchEnd);
    slider.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
      slider.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [currentIndex, touchPoints, isSwiping, touchStartX]);

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
