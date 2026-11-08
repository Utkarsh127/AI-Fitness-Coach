/**
 * @module utils/ApiResponse
 * @description Standardised success response wrapper.
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, 'Fetched successfully'));
 *
 * Shape:
 *   { success: true, statusCode, message, data }
 */

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*}      data       - Response payload
   * @param {string} message    - Human-readable success message
   */
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
