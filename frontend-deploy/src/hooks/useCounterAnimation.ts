import { useEffect, useState } from "react";

export const useCounterAnimation = (
  endValue: number,
  duration: number = 2000,
  startOnMount: boolean = false
) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible && !startOnMount) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCurrentValue(Math.floor(endValue * easeOutQuart));

      if (progress === 1) {
        clearInterval(timer);
        setCurrentValue(endValue);
      }
    }, 16); // 60fps

    return () => clearInterval(timer);
  }, [endValue, duration, isVisible, startOnMount]);

  return { currentValue, setIsVisible };
};
