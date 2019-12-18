import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/genres";

function genreUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getGenres() {
  return http.get(apiEndpoint);
}
export function getGenre(genreId) {
  return http.get(genreUrl(genreId));
}

export function saveGenre(genre) {
  if (genre._id) {
    const body = { ...genre };
    delete body._id;
    return http.put(genreUrl(genre._id), body);
  }

  return http.post(apiEndpoint, genre);
}

export function deleteGenre(genreId) {
  return http.delete(genreUrl(genreId));
}
