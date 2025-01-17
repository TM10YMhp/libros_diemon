import { Book } from "./types";

export const getBooks = async (genre?: string): Promise<Book[]> => {
  // simular fetch con lazy import
  const data = await import("@/data/books.json");
  const books = data.library.map((x) => x.book);

  if (!genre) return books;

  const matches = books.filter((x) => x.genre === genre);
  return matches;
};

export const getGenres = async (): Promise<Book["genre"][]> => {
  const books = await getBooks();
  return Array.from(new Set(books.map((x) => x.genre)));
};
