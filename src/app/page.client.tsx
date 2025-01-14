"use client";

import dynamic from "next/dynamic";
import Loading from "./loading";

import { useEffect, useMemo, useState } from "react";
import { page_metadata } from "./config";
import { metadata } from "./layout";

interface Props {
  books: Book[];
  genres: string[];
}

function HomePageClient({ books, genres }: Props) {
  const [genre, setGenre] = useState("");
  const matches = useMemo(() => {
    if (!genre) return books;

    return books.filter((book) => {
      if (book.genre !== genre) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);

  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(new Set());
  const handleBookClick = (book: Book["ISBN"]) => {
    // const draft = readList.includes(book)
    //   ? readList.filter((readBook) => readBook !== book)
    //   : [...readList, book];
    // setReadList(draft);

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
    const defaultTitle = String(page_metadata.title) || "";
    const awayTitle = "¡No te vayas😭! 🗣";

    window.addEventListener("load", () => {
      document.title = defaultTitle;
    });

    window.addEventListener("visibilitychange", () => {
      document.title = document.hidden ? awayTitle : defaultTitle;
    });
  }, []);

  useEffect(() => {
    function getReadList() {
      const readList = JSON.parse(localStorage.getItem("readList") ?? "[]");
      setReadList(new Set(readList));
    }

    getReadList();

    window.addEventListener("storage", getReadList);

    return () => window.removeEventListener("storage", getReadList);
  }, []);

  return (
    <article className="grid gap-6">
      <nav>
        <select
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
        >
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </nav>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
        {matches.map((book) => (
          <li
            key={book.ISBN}
            className="grid gap-2"
            onClick={() => handleBookClick(book.ISBN)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="aspect-[9/14] object-cover"
              loading="lazy"
              alt={book.title}
              src={book.cover}
            />
            <p>
              {book.title}
              {readList.has(book.ISBN) && <span>⭐ </span>}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default dynamic(async () => HomePageClient, {
  ssr: false,
  loading: Loading,
});
