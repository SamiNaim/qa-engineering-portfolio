import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.ENV || 'dev';

dotenv.config({
  path: path.resolve(__dirname, `.env.${environment}`),
  quiet: true,
});

/**
 * Reads a required environment variable, failing loudly at load time.
 *
 * Without this, a missing variable is silently `undefined` and only surfaces
 * much later as a confusing `goto("undefined/login")`.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Expected it in config/.env.${environment} — see config/.env.example.`
    );
  }
  return value;
}

export const env = {
  name: environment,
  baseUrls: {
    theInternet: requireEnv('BASE_URL_THE_INTERNET'),
    sauceDemo: requireEnv('BASE_URL_SAUCE_DEMO'),
    automationExercise: requireEnv('BASE_URL_AUTOMATION_EXERCISE'),
    demoQA: requireEnv('BASE_URL_DEMOQA'),
  },
  credentials: {
    sauce: {
      username: requireEnv('SAUCE_USERNAME'),
      password: requireEnv('SAUCE_PASSWORD'),
      lockedOutUsername: requireEnv('SAUCE_LOCKED_OUT_USERNAME'),
    },
  },
} as const;
