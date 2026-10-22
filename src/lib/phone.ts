import { formatPhoneNumberIntl, isValidPhoneNumber } from "react-phone-number-input";

/**
 * Formats a stored E.164 number for display (e.g. "+44 20 7946 0958").
 * Legacy free-text numbers that aren't valid international numbers are shown as entered.
 */
export const formatPhoneForDisplay = (value: string): string =>
  isValidPhoneNumber(value) ? formatPhoneNumberIntl(value) : value;
