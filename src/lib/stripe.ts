import { loadStripe } from "@stripe/stripe-js";

// loadStripe caches its own script tag/instance internally, but memoizing the promise here too
// avoids kicking off the load more than once across remounts of the unlock modal.
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not configured");
        }
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};
