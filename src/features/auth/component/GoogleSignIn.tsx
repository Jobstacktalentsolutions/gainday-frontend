import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { GOOGLE_CLIENT_ID } from "../config/google";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";

interface GoogleSignInProps {
    redirect: string | null;
    portal: "employer" | "candidate";
}

/** Google's own sign-in button, with One Tap (the card at the top right) on the same page. Renders
 *  nothing when no client ID is configured. */
export function GoogleSignIn({ redirect, portal }: GoogleSignInProps) {
    const signIn = useGoogleSignIn(redirect, portal);

    if (!GOOGLE_CLIENT_ID) return null;

    return (
        <div className="flex w-full justify-center">
            <GoogleLogin
                useOneTap
                shape="pill"
                size="large"
                theme="outline"
                onSuccess={(response) => {
                    if (response.credential) signIn.mutate(response.credential);
                }}
                onError={() => toast.error("Google sign-in didn't work. Please try again.")}
            />
        </div>
    );
}
