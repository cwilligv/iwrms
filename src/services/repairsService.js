// endpoint for repairs routes
import axios from 'axios';
const API_BASE = "/wp-json/iwrms/v1/repairs";
const NONCE = window.iwrmsSettings?.nonce || null;

// display error code 
async function handleResponse(res) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (json && json.message) || `Request failed (status ${res.status})`;
    throw new Error(msg);
  }
  return json;
}

/**
 * Fetch all repairs.
 * Sends credentials so the WP login cookie is included,
 * and X-WP-Nonce if available.
 *
 * @returns {Promise<Array>}
 */
export async function fetchRepairs() {
  const headers = {};
  if (NONCE) headers["X-WP-Nonce"] = NONCE;

  const res = await fetch(API_BASE, {
    method:      "GET",
    credentials: "include",
    headers,
  });

  return handleResponse(res);
}

/**
 * Create a new repair record
 *
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function createRepair(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (NONCE) headers["X-WP-Nonce"] = NONCE;

  const res = await fetch(API_BASE, {
    method:      "POST",
    credentials: "include",
    headers,
    body:        JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteRepair(id) {
  return axios.delete(`/wp-json/iwrms/v1/repairs/${id}`);
}

export function updateRepair(id, payload) {
  return axios.put(`/wp-json/iwrms/v1/repairs/${id}`, payload, {
      headers: { "X-WP-Nonce": iwrmsSettings.nonce }
    })
    .then(r => r.data);
}
