export interface Book {
  title: string;
  pages: number;
  genre: string;
  cover: string;
  synopsis: string;
  year: number;
  ISBN: string;
  author: {
    name: string;
    otherBooks: string[];
  };
}

export interface User {
  id: string;
  name: string;
  points: number;
}

export enum Sort {
  HighestPrice = "Alto precio",
  LowestPrice = "Bajo precio",
  MostRecent = "Más reciente",
}
