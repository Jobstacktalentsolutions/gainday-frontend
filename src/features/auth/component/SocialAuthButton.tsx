import googleIcon from "@/assets/Google.svg";

interface SocialAuthButtonProps {
    label: string
    onClick?: () => void
}

const SocialAuthButton = ({ label, onClick }: SocialAuthButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-primary-500 px-6 text-base text-primary-500"
        >
            <img
                src={googleIcon}
                alt="Google icon"
                className="size-4"
            />
            {label}

        </button>
    )
}

export default SocialAuthButton;


