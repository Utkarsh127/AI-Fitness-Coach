/**
 * @module services/tokenService
 * @description Access token in-memory storage.
 *
 * Stores the access token in a module-scoped variable (not localStorage) for
 * XSS safety. The refresh token is stored in an httpOnly cookie managed by
 * the server and is not accessible to JavaScript.
 *
 * On page reload the access token is lost, but the refresh token cookie
 * persists — so the app calls /auth/refresh on mount to get a new access token.
 */

let _accessToken = null;

const tokenService = {
  /** Store the access token in memory. */
  setToken(token) {
    _accessToken = token;
  },

  /** Retrieve the current access token. */
  getToken() {
    return _accessToken;
  },

  /** Clear the in-memory access token (e.g., on logout). */
  clearToken() {
    _accessToken = null;
  },

  /** Returns true if an access token is currently stored. */
  hasToken() {
    return !!_accessToken;
  },
};

export default tokenService;
