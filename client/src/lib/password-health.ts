import { Password } from "@shared/schema";
import { decryptPassword } from "./crypto";

export interface PasswordStrength {
  score: number; // 0-100
  label: "weak" | "fair" | "good" | "strong";
  color: "red" | "yellow" | "blue" | "green";
  recommendations: string[];
}

export function analyzePassword(password: string): PasswordStrength {
  const recommendations: string[] = [];
  let score = 0;

  // Check length
  if (password.length < 8) {
    recommendations.push("Use at least 8 characters");
  } else if (password.length < 12) {
    recommendations.push("Consider using at least 12 characters for stronger security");
  }
  score += Math.min(password.length * 4, 40); // Up to 40 points for length

  // Check character types
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!hasLower) recommendations.push("Add lowercase letters");
  if (!hasUpper) recommendations.push("Add uppercase letters");
  if (!hasNumber) recommendations.push("Add numbers");
  if (!hasSymbol) recommendations.push("Add special characters");

  score += (hasLower ? 10 : 0) +
           (hasUpper ? 15 : 0) +
           (hasNumber ? 15 : 0) +
           (hasSymbol ? 20 : 0);

  // Check for repeated characters
  const repeatedChars = /(.)\1{2,}/.test(password);
  if (repeatedChars) {
    score -= 10;
    recommendations.push("Avoid repeating characters");
  }

  // Check for sequential patterns
  const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (hasSequential) {
    score -= 10;
    recommendations.push("Avoid sequential patterns");
  }

  // Determine label and color based on score
  let label: PasswordStrength["label"];
  let color: PasswordStrength["color"];

  if (score < 40) {
    label = "weak";
    color = "red";
  } else if (score < 60) {
    label = "fair";
    color = "yellow";
  } else if (score < 80) {
    label = "good";
    color = "blue";
  } else {
    label = "strong";
    color = "green";
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label,
    color,
    recommendations
  };
}

export function getOverallHealth(passwords: Password[], masterKey: string): {
  score: number;
  weak: number;
  reused: number;
  total: number;
} {
  let totalScore = 0;
  let weakCount = 0;
  const decryptedPasswords = new Set<string>();
  let reusedCount = 0;

  passwords.forEach(password => {
    const decrypted = decryptPassword(password.encryptedPassword, masterKey);
    const analysis = analyzePassword(decrypted);
    
    totalScore += analysis.score;
    if (analysis.score < 40) weakCount++;
    
    if (decryptedPasswords.has(decrypted)) {
      reusedCount++;
    } else {
      decryptedPasswords.add(decrypted);
    }
  });

  return {
    score: passwords.length > 0 ? Math.round(totalScore / passwords.length) : 0,
    weak: weakCount,
    reused: reusedCount,
    total: passwords.length
  };
}
