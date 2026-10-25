/** A same-site path to return to after an action, from a `?redirect=` value. Anything that could
 *  leave the site (a full URL, or a protocol-relative `//host`) is ignored. */
export function toSafeRedirect(value: string | null): string | null {
    if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
    return value;
}

/** `path` with `?redirect=` appended when there is one to carry forward. */
export function withRedirect(path: string, redirect: string | null): string {
    return redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;
}
