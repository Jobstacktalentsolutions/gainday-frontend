const currencyFormatter = (currency: "USD" | "GBP") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 });

/**
 * Headline revenue in USD when an exchange rate is configured, otherwise in GBP with a note.
 * `usd` is null exactly when no rate is configured.
 */
export const formatRevenue = (pence: number, usd: number | null) => {
  const gbp = currencyFormatter("GBP").format(pence / 100);
  if (usd === null) {
    return { primary: gbp, secondary: "USD unavailable: no exchange rate configured" };
  }
  return { primary: currencyFormatter("USD").format(usd), secondary: `${gbp} collected` };
};

export const formatAmountForCurrency = (amount: number, currency: "USD" | "GBP") =>
  currencyFormatter(currency).format(amount);

/** Signed fiat value of a ledger row: USD when available, otherwise GBP. "—" when unvalued. */
export const formatSignedFiat = (pence: number | null, usd: number | null) => {
  if (pence === null) {
    return "—";
  }
  const sign = pence > 0 ? "+" : "";
  if (usd === null) {
    return `${sign}${formatAmountForCurrency(pence / 100, "GBP")}`;
  }
  return `${sign}${formatAmountForCurrency(usd, "USD")}`;
};
