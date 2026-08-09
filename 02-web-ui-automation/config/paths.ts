import path from 'path';

/** Where the Sauce Demo signed-in session is cached by `tests/auth.setup.ts`. */
export const SAUCE_STORAGE_STATE = path.resolve(__dirname, '../playwright/.auth/sauce.json');

/** An explicitly empty session, for specs that must start logged out. */
export const LOGGED_OUT_STATE = { cookies: [], origins: [] };
