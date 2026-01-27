import { AuthService } from './lib/auth.js';

interface FailedAttempt {
    count: number;
    blockedUntil: number;
}

// Access the private failedAttempts map via reflection
const failedAttempts = (AuthService as unknown as { failedAttempts: Map<string, FailedAttempt> }).failedAttempts;


if (failedAttempts && failedAttempts.size > 0) {
  failedAttempts.forEach((value, key) => {
    const now = Date.now();
    const isBlocked = value.blockedUntil > now;
    if (isBlocked) {
      const remainingMinutes = Math.ceil((value.blockedUntil - now) / 60000);
      console.log(`IP ${key} est bloquée pour encore ${remainingMinutes} minutes.`);
    }
  });
} else {
  console.log("Aucune IP n'est actuellement bloquée.");
}
