import HomeClientPage from "./page.client";

const getBooks = async (): Promise<Book[]> => {
  return import("@/data/books.json").then((data) =>
    data.library.map((data) => data.book),
  );
};

export default async function HomePage() {
  const books = await getBooks();
  const genres: Book["genre"][] = Array.from(
    new Set(books.map((book) => book.genre)),
  );

  return <HomeClientPage books={books} genres={genres} />;
}
