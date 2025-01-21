import { useEffect, useState } from "react";
import { page_metadata } from "./config";
import { Book } from "./types";
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

export const useReadList = () => {
  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(new Set());

  const addBookToReadList = (book: Book["ISBN"]) => {
    // const draft = readList.includes(book)
    //   ? readList.filter((x) => x !== book)
    //   : readList.concat(book)

    const draft = structuredClone(readList);
    if (draft.has(book)) {
      draft.delete(book);
    } else {
      draft.add(book);
    }

    setReadList(draft);

    localStorage.setItem("readList", JSON.stringify(Array.from(draft)));
  };

  useEffect(() => {
    function getReadList() {
      const readList = JSON.parse(localStorage.getItem("readList") ?? "[]");
      setReadList(new Set(readList));
    }

    getReadList();

    window.addEventListener("storage", getReadList);

    return () => window.removeEventListener("storage", getReadList);
  }, []);

  return { readList, addBookToReadList };
};
