import CryptoJS from 'crypto-js';

export function generateKey(masterPassword: string): string {
  return CryptoJS.PBKDF2(masterPassword, 'salt', { 
    keySize: 256/32,
    iterations: 1000 
  }).toString();
}

export function encryptPassword(password: string, key: string): string {
  return CryptoJS.AES.encrypt(password, key).toString();
}

export function decryptPassword(encryptedPassword: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function generatePassword(
  length = 16,
  options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  }
): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = "";
  if (options.uppercase) chars += uppercase;
  if (options.lowercase) chars += lowercase;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
