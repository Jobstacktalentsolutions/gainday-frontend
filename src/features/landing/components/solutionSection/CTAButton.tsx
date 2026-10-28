import { Button } from "@/components/ui/button";
import arrowTr from "@/assets/arrow-tr.svg";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    label: string;
    onClick?: () => void;
    size?: "md" | "lg";
}

const CTAButton = ({ label, onClick, size = "md" }: CTAButtonProps) => (
    <Button
        onClick={onClick}
        className={cn(
            "flex cursor-pointer items-center justify-center bg-primary-500 text-base transition-colors duration-300 hover:bg-primary-600",
            size === "lg" ? "h-13 gap-3 rounded-xl py-1 pl-6 pr-1" : "h-11 gap-2 py-2 pl-4 pr-1",
        )}
    >
        {label}
        <span
            className={cn(
                "flex items-center justify-center rounded-lg bg-secondary-500",
                size === "lg" ? "h-full w-11" : "size-9",
            )}
        >
            <img src={arrowTr} alt="" />
        </span>
    </Button>
);

export default CTAButton;