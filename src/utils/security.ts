import CryptoJS from 'crypto-js'

// Hash password before sending to backend
// Uses SHA-256 for transport security
export const hashPasswordForTransport = (password: string): string => {
  return CryptoJS.SHA256(password).toString()
}
