import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customers";

function customerUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCustomers() {
  return http.get(apiEndpoint);
}
export function getCustomer(customerId) {
  return http.get(customerUrl(customerId));
}

export function saveCustomer(genre) {
  if (genre._id) {
    const body = { ...genre };
    delete body._id;
    return http.put(customerUrl(genre._id), body);
  }

  return http.post(apiEndpoint, genre);
}

export function deleteCustomer(customerId) {
  return http.delete(customerUrl(customerId));
}
