import { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500 && window.innerWidth < 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-2.5 right-2.5 z-50  flex h-8 w-8 items-center justify-center rounded-full border bg-white p-2 dark:text-black md:hidden lg:block"
        >
          <ChevronUpIcon />
        </button>
      )}
    </>
  );
}

export default ScrollToTop;