import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/rentals";

function rentalUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getRentals() {
  return http.get(apiEndpoint);
}
export function getRental(rentalId) {
  return http.get(rentalUrl(rentalId));
}

export function saveRental(rental) {
  if (rental._id) {
    const body = { ...rental };
    delete body._id;
    return http.put(rentalUrl(rental._id), body);
  }

  return http.post(apiEndpoint, rental);
}

export function deleteRental(rentalId) {
  return http.delete(rentalUrl(rentalId));
}
