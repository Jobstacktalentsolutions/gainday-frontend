/** Display form for a stored salary: 23222343 -> "23,222,343". Empty when no amount is set. */
export const formatSalaryInput = (amount: number | undefined): string =>
    amount === undefined ? "" : amount.toLocaleString("en-GB");

/** Typed text -> stored number: "23,222,343" -> 23222343. Non-digits are ignored; empty -> undefined. */
export const parseSalaryInput = (text: string): number | undefined => {
    const digits = text.replace(/\D/g, "");
    return digits === "" ? undefined : Number(digits);
};
