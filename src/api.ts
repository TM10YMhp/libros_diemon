import { Book, Sort, User } from "./types";

export const getUser = async (): Promise<User> => {
  const user = {
    id: "5a03638052fd231590d04eb5",
    name: "John Kite",
    points: 1000,
    redeemHistory: [],
  };

  return await new Promise((resolve) => {
    return setTimeout(() => resolve(user), 500);
  });
};

export const getBooks = async (
  criteria: { genre?: string; sort?: Sort } = {},
): Promise<Book[]> => {
  // simular fetch con lazy import
  const data = await import("@/data/books.json");
  const books = data.library.map((x) => x.book);

  const { genre, sort } = criteria;

  const applySort = (books: Book[]) => {
    switch (sort) {
      case "HighestPrice":
        return [...books].sort((a, b) => b.pages - a.pages);

      case "LowestPrice":
        return [...books].sort((a, b) => a.pages - b.pages);

      case "MostRecent":
      default:
        return books;
    }
  };

  const applyGenre = (books: Book[]) => {
    if (!genre) return books;
    return books.filter((x) => x.genre === genre);
  };

  const matches = applySort(applyGenre(books));
  return matches;
};

export const getGenres = async (): Promise<Book["genre"][]> => {
  const books = await getBooks();
  return Array.from(new Set(books.map((x) => x.genre)));
};

export const redeem = (book: Book): Promise<string> => {
  return Promise.resolve(
    `You have redeem the product successfull (${book.title})`,
  );
};

export const addPoints = (amount: number): Promise<number> => {
  return Promise.resolve(amount);
};
