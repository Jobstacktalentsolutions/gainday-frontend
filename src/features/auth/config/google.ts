/** Google Identity Services client ID. A public identifier, not a secret. When it's unset, Google
 *  sign-in is hidden rather than breaking the page. */
export const GOOGLE_CLIENT_ID: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;
