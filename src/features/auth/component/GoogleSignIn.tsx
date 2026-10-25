import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { GOOGLE_CLIENT_ID } from "../config/google";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";

interface GoogleSignInProps {
    redirect: string | null;
}

/** Google's own sign-in button, with One Tap (the card at the top right) on the same page. Renders
 *  nothing when no client ID is configured. */
export function GoogleSignIn({ redirect }: GoogleSignInProps) {
    const signIn = useGoogleSignIn(redirect);

    if (!GOOGLE_CLIENT_ID) return null;

    return (
        <div className="flex w-full justify-center">
            <GoogleLogin
                useOneTap
                onSuccess={(response) => {
                    if (response.credential) signIn.mutate(response.credential);
                }}
                onError={() => toast.error("Google sign-in didn't work. Please try again.")}
            />
        </div>
    );
}
