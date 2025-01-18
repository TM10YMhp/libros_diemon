"use client";

import dynamic from "next/dynamic";
import Loading from "./loading";

import { getBooks } from "@/api";
import { page_metadata } from "@/config";
import { useUserState, useUserUpdater } from "@/context";
import { Book } from "@/types";
import { cx, debounce, throttle } from "@/utils";
import { useEffect, useState } from "react";

interface Props {
  books: Book[];
  genres: string[];
}

function HomePageClient({ books, genres }: Props) {
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

  const { user } = useUserState();
  const { addPoints, redeem } = useUserUpdater();

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

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    addPoints(Math.floor(Math.random() * 30) * 10 + 100);

    const rect = event.currentTarget.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const originX = (rect.x + 0.5 * rect.width) / width;
    const originY = (rect.y + 0.5 * rect.height) / height;

    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
        particleCount: 5,
        startVelocity: 10,
        gravity: 0.7,
        ticks: 50,
        zIndex: 10,
        origin: {
          x: originX,
          y: originY,
        },
      });
    });
  };

  const handleRedeem = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    book: Book,
  ) => {
    event.stopPropagation();

    if (!user) return;

    const canBuy = book.pages <= user.points;
    if (!canBuy) return;

    redeem(book);

    const rect = event.currentTarget.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const originX = (rect.x + 0.5 * rect.width) / width;
    const originY = (rect.y + 0.5 * rect.height) / height;

    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        colors: ["#bb0000", "#ffffff"],
        particleCount: 8,
        startVelocity: 15,
        gravity: 2,
        ticks: 40,
        zIndex: 10,
        origin: {
          x: originX,
          y: originY,
        },
      });
    });
  };

  return (
    <article className="grid gap-6">
      <div
        className="fixed h-1 top-0 left-0 bg-yellow-500"
        style={{
          width: `${scrollPosition}%`,
          transition: "width 0.2s ease-out",
        }}
      />
      <nav className="flex flex-row gap-6 items-center">
        <select
          className="border rounded-md h-full bg-stone-900"
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
          className={cx(
            "cursor-pointer select-none bg-stone-900 p-1",
            "border rounded-full flex flex-row gap-1 z-20",
          )}
          onClick={handleClick}
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
            <button
              className={cx(
                "absolute px-1 rounded-br-lg bg-stone-900 border select-none",
                "hover:bg-stone-600",
                book.pages <= Number(user?.points) ||
                  "bg-red-900 hover:bg-red-600",
              )}
              onClick={(e) => handleRedeem(e, book)}
            >
              {book.pages}
            </button>
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
