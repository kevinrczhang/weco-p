/**
 * @fileoverview File to store application constants.
 */

import { is } from './utils/str-utils'

/**
 * Deep freezes an object (i.e makes all properties of an object readonly).
 * @param {O} o The object to freeze.
 * @returns {Readonly<O>}
 * @template O
 */
function deepFreeze (o) {
  for (const key of Object.keys(o)) {
    const val = o[key]
    if (val && typeof val === 'object') {
      deepFreeze(val)
    }
  }

  return Object.freeze(o)
}

export default deepFreeze({
  BASE_URL: (() => {
    const apiOrigin = process.env.REACT_APP_API_ORIGIN
    if (typeof apiOrigin === 'string' && is.absUrl(apiOrigin)) {
      // Only use the origin (protocol://domain.com:port).
      return new URL(apiOrigin).origin
    }
    // Fallback to localhost.
    return 'http://127.0.0.1:8000'
  })(),
  EXTERN_LINK_NAMES: [
    'website',
    'twitter',
    'facebook',
    'instagram',
    'linkedin',
    'youtube',
    'twitch',
  ]
})
