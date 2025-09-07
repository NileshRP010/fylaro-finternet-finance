import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export const AnimatedCounter = ({
  value,
  className = "",
  duration = 2000,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Parse the target value and format
    const parseTargetValue = () => {
      if (value === "$127M+") {
        return { target: 127, format: (n: number) => `$${n}M+` };
      } else if (value === "8,250+") {
        return {
          target: 8250,
          format: (n: number) => `${n.toLocaleString()}+`,
        };
      } else if (value === "45,000+") {
        return {
          target: 45000,
          format: (n: number) => `${n.toLocaleString()}+`,
        };
      } else if (value === "99.2%") {
        return { target: 99.2, format: (n: number) => `${n.toFixed(1)}%` };
      }
      return { target: 0, format: (n: number) => n.toString() };
    };

    const { target, format } = parseTargetValue();
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easeOutCubic;

      setDisplayValue(format(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure final value matches exactly
      }
    };

    animate();
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className={className}>
      {displayValue}
    </div>
  );
};
