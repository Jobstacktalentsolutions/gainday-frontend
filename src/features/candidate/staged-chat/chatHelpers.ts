/** Up to two initials from a display name: "Priya Shah" -> "PS", "Sam" -> "S". */
export function initialsOf(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

/** Ctrl+Enter (or Cmd+Enter) sends. A plain Enter keeps the newline. */
export function isSendShortcut(event: { key: string; ctrlKey: boolean; metaKey: boolean }): boolean {
    return event.key === "Enter" && (event.ctrlKey || event.metaKey);
}
