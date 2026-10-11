export const getFirstName = (fullName?: string | null): string | null => {
    const first = fullName?.trim().split(/\s+/)[0];
    return first ? first : null;
};