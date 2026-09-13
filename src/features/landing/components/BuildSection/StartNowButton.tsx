import { Button } from "@/components/ui/button"
import arrowTr from "@/assets/arrow-tr.svg"

interface CTAButtonProps {
    label: string;
    onClick?: () => void;
}

const StartNowButton = ({ label, onClick }: CTAButtonProps) => {
    return (
        <Button
            onClick={onClick}
            className="text-base text-info-950 h-11 flex gap-3 cursor-pointer items-center justify-center pl-6 pr-1 py-2 bg-primary-50 hover:bg-primary-200"
        >
            {label}
            <span className="w-9 h-9 bg-secondary-500 flex items-center justify-center rounded-[8px]">
                <img
                    src={arrowTr}
                    alt="arrow pointing North East"
                />
            </span>
        </Button>
    );
}

export default StartNowButton;