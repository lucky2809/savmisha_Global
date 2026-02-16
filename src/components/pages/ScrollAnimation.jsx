import { useEffect, useRef, useState } from "react";

function useScrollAnimation() {
  const ref = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index;
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, Number(index)])]);
          }
        });
      },
      { threshold: 0.08 }
    );

    ref.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default useScrollAnimation