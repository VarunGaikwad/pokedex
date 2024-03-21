import { useEffect, useState } from "react";
import ArrowUpIcon from "../assets/up-arrow.svg";
export default function FloatButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        // Adjust the scroll threshold as needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 rounded-full right-4 shadow transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0"
      } z-10`}
    >
      <img src={ArrowUpIcon} />
    </button>
  );
}
