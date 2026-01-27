import { AuthService } from './lib/auth.js';

// Clear all IP blocks
const failedAttempts = (AuthService as unknown as { failedAttempts: Map<string, unknown> }).failedAttempts;
if (failedAttempts) {
    failedAttempts.clear();
    console.log("Tous les blocages d'IP ont été levés.");
}

