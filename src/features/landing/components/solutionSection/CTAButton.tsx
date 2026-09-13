import { Button } from "@/components/ui/button"
import arrowTr from "@/assets/arrow-tr.svg"

interface CTAButtonProps {
    label: string;
    onClick?: () => void;
}

const CTAButton = ({ label, onClick }: CTAButtonProps) => {
    return (
        <Button
            onClick={onClick}
            className="text-base h-11 flex gap-2 items-center justify-center pl-4 pr-1 py-2 bg-primary-500 hover:bg-primary-600"
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

export default CTAButton;