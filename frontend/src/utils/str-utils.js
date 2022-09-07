/**
 * @fileoverview Random string utility functions.
 */

/**
 * Validation-related functions.
 */
export const is = {
  /**
   * Checks that the string is an absolute URL.
   * @param {string} str The string to check.
   * @returns {boolean}
   */
  absUrl: str => {
    try {
      new URL(str)
      return true
    } catch (ex) {
      return false
    }
  }
}

/**
 * Uppercases the first letter of a string.
 * @param {string} str The string to operate on.
 * @returns {string}
 */
export function upperCaseFirst (str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}
