"use client";

import dynamic from "next/dynamic";
import Loading from "./loading";

import { getBooks } from "@/api";
import { useUserState, useUserUpdater } from "@/context";
import { useCartUpdater } from "@/features/cart/context";
import { Drawer } from "@/features/ui/components/Drawer";
import { useDynamicTitle, useReadList, useScrollPosition } from "@/hooks";
import { Book, Sort } from "@/types";
import { cx, launchConfetti } from "@/utils";
import { useEffect, useState } from "react";

export const HomePageClientDynamic = dynamic(async () => HomePageClient, {
  ssr: false,
  loading: Loading,
});

type Props = {
  books: Book[];
  genres: string[];
};

export function HomePageClient({ books, genres }: Props) {
  const scrollPosition = useScrollPosition();

  const { user } = useUserState();
  const { redeem } = useUserUpdater();

  const { addItem } = useCartUpdater();

  const { readList, addBookToReadList } = useReadList();

  useDynamicTitle("¡No te vayas😭! 🗣");

  const [matches, setMatches] = useState<Book[]>([]);
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<Sort>(Sort.MostRecent);

  useEffect(() => {
    getBooks({ genre, sort }).then((books) => {
      setMatches(books);
    });
  }, [genre, sort]);

  const handleRedeem = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    book: Book,
  ) => {
    event.stopPropagation();

    if (!user) return;

    const canBuy = book.pages <= user.points;
    if (!canBuy) return;

    redeem(book);

    addItem({
      id: book.ISBN,
      title: book.title,
      description: book.synopsis,
      image: book.cover,
      price: book.pages,
    });

    launchConfetti(event.currentTarget, {
      colors: ["#bb0000", "#ffffff"],
      particleCount: 8,
      startVelocity: 15,
      gravity: 2,
      ticks: 40,
    });
  };

  /* eslint-disable @next/next/no-img-element */
  return (
    <article className="grid gap-4">
      <div
        className={cx(
          "fixed h-1 top-0 left-0 bg-yellow-600 z-50",
          "transition-[width] duration-200 ease-out",
        )}
        style={{ width: `${scrollPosition}%` }}
      />
      <nav className="flex flex-wrap gap-y-2 gap-x-6">
        <div className="flex flex-row gap-2">
          <p>filtrar por genero:</p>
          <select
            className="border rounded-md h-full w-32"
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
        </div>
        <div className="flex flex-row gap-2">
          <p>ordenar:</p>

          <select
            className="border rounded-md h-full w-32"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            {Object.values(Sort).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <p>
        mostrando {matches.length} de {books.length} libros
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {matches.map((book) => (
          <li
            key={book.ISBN}
            className="grid gap-2"
            onClick={() => addBookToReadList(book.ISBN)}
          >
            <button
              className={cx(
                "absolute px-1 rounded-br-lg bg-base-100 border select-none",
                "hover:bg-stone-600 flex flex-row gap-1 items-center",
                book.pages <= Number(user?.points) ||
                  "!bg-red-900 hover:!bg-red-600",
              )}
              onClick={(e) => handleRedeem(e, book)}
            >
              <img
                src="https://cryptologos.cc/logos/dogebonk-dobo-logo.svg?v=040"
                alt="memecoin"
                width={15}
              />
              {book.pages}
            </button>
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
      <Drawer />
    </article>
  );
}
