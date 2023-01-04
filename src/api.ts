const API_KEY = "b5d950f7520d9a485a3332457d17f478";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  genres_ids: number[];
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  totla_results: number;
}

export function getNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
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
export function getMovieDetails(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((resposne) => resposne.json());
}

export interface IGetCredits {
  id: number;
  cast: {
    name: string;
  }[];
}

export function getCredits(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
  ).then((resposne) => resposne.json());
}
