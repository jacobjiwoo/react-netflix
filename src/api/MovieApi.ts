const API_KEY = "b5d950f7520d9a485a3332457d17f478";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  title: string;
  original_title: string;
  overview: string;
}

export interface IGetMoviesResult {
  results: IMovie[];
}

export interface IGetMovieDetails {
  backdrop_path: string;
  genres: { name: string }[];
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number;
  tagline: string;
  vote_average: number;
}

export interface IGetMovieCredits {
  id: number;
  cast: {
    name: string;
  }[];
}

export function getMovieDetails(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((resposne) => resposne.json());
}
export function getNowPlayingMovie() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getPopularMovie() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTopRatedMovie() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getUpcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getMovieCredits(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
  ).then((resposne) => resposne.json());
}

export function getMovieSearch(query: string) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}`
  ).then((resposne) => resposne.json());
}