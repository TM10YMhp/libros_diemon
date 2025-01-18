import { useEffect, useState } from "react";
import { page_metadata } from "./config";
import { debounce, throttle } from "./utils";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    setScrollPosition(Math.round(scrollPercentage));
  };

  useEffect(() => {
    const throttled = throttle(handleScroll, 150);
    const debounced = debounce(handleScroll, 50);
    const optimizedHandleScroll = () => {
      throttled();
      debounced();
    };

    window.addEventListener("scroll", optimizedHandleScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", optimizedHandleScroll);
  }, []);

  return scrollPosition;
};

export const useDynamicTitle = (newTitle: string) => {
  useEffect(() => {
    const defaultTitle = String(page_metadata.title || "");

    window.addEventListener("load", () => {
      document.title = defaultTitle;
    });

    window.addEventListener("visibilitychange", () => {
      document.title = document.hidden ? newTitle : defaultTitle;
    });
  }, [newTitle]);
};
