import { getBooks, getGenres } from "@/api";
import { Book } from "@/types";
import HomeClientPage from "./page.client";

export default async function HomePage() {
  const books = await getBooks();
  const genres = await getGenres();

  return <HomeClientPage books={books} genres={genres} />;
}
