import { getBooks, getGenres } from "@/api";
import { HomePageClient } from "./page.client";

export default async function HomePage() {
  const books = await getBooks();
  const genres = await getGenres();

  return <HomePageClient books={books} genres={genres} />;
}
