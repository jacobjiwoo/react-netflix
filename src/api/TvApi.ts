const API_KEY = "b5d950f7520d9a485a3332457d17f478";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface ITv {
  id: number;
  backdrop_path: string;
  name: string;
  original_name: string;
  overview: string;
}

export interface IGetTvResult {
  results: ITv[];
}

export interface IGetTvDetails {
  backdrop_path: string;
  genres: { name: string }[];
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  number_of_episodes: number;
  tagline: string;
  overview: string;
  vote_average: number;
}

export interface IGetTvCredits {
  id: number;
  cast: {
    name: string;
  }[];
}
export function getTvDetails(tvId: number) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
    ).then((resposne) => resposne.json());
  }
  export function getTvCredits(tvId: number) {
    return fetch(
      `${BASE_PATH}/tv/${tvId}/credits?api_key=${API_KEY}&language=ko-KR`
    ).then((response) => response.json());
  }
export function getTvSearch(query: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${query}`
  ).then((resposne) => resposne.json());
}
export function getAiringTodayTv() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getOnTheAirTv() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getPopularTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTopRatedTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}