"use client";

import dynamic from "next/dynamic";
import Loading from "./loading";

import { getBooks } from "@/api";
import { page_metadata } from "@/config";
import { useUserState, useUserUpdater } from "@/context";
import { Book } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  books: Book[];
  genres: string[];
}

function HomePageClient({ books, genres }: Props) {
  const { user } = useUserState();
  const { addPoints } = useUserUpdater();

  const [matches, setMatches] = useState<Book[]>([]);
  const [genre, setGenre] = useState("");

  const [readList, setReadList] = useState<Set<Book["ISBN"]>>(new Set());
  const handleBookClick = (book: Book["ISBN"]) => {
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
    getBooks(genre).then((books) => {
      setMatches(books);
    });
  }, [genre]);

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
      <nav className="flex flex-row gap-6 items-center">
        <select
          className="border rounded-md h-full"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <div
          className="flex flex-row border rounded-full p-1 gap-1 cursor-pointer select-none"
          onClick={() => addPoints(Math.floor(Math.random() * 30) * 10 + 100)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=040"
            alt="memecoin"
            width={25}
          />
          <p className="pr-2">{user?.points ?? "woof..."}</p>
        </div>
        <p className="pr-2">
          mostrando {matches.length} de {books.length} libros
        </p>
      </nav>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
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
