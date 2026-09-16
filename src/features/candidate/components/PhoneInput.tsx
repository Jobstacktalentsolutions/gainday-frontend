import { forwardRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface PhoneCountry {
    code: string;
    dialCode: string;
    label: string;
    placeholder: string;
}

// Small hand-picked list, not full ISO-3166 coverage. To be extended as needed.
export const PHONE_COUNTRIES: PhoneCountry[] = [
    { code: "US", dialCode: "+1", label: "United States", placeholder: "(555) 000-0000" },
    { code: "GB", dialCode: "+44", label: "United Kingdom", placeholder: "7400 123456" },
    { code: "NG", dialCode: "+234", label: "Nigeria", placeholder: "801 234 5678" },
    { code: "DE", dialCode: "+49", label: "Germany", placeholder: "151 23456789" },
    { code: "CA", dialCode: "+1", label: "Canada", placeholder: "(555) 000-0000" },
];

interface PhoneInputProps {
    label?: string;
    countryCode: string;
    onCountryChange: (code: string) => void;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            label = "Phone number",
            countryCode,
            onCountryChange,
            value,
            onChange,
            onBlur,
            error
        }, ref
    ) => {

        const [open, setOpen] = useState(false);
        const selected = PHONE_COUNTRIES.find((c) => c.code === countryCode) ?? PHONE_COUNTRIES[0];
        const hasError = Boolean(error);


        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-neutral-800 select-none">{label}</label>
                <div
                    className={cn(
                        "flex h-12 items-center rounded-lg border bg-white transition-all duration-200",
                        hasError
                            ? "border-error-400 ring-3 ring-error-400/20"
                            : "border-neutral-200 focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/20",
                    )}
                >
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                            className="flex shrink-0 items-center gap-1 border-r border-neutral-200 px-3.5 py-2.5 text-base text-neutral-900 outline-none"
                        >
                            {selected.code}
                            <ChevronDown className="size-4 text-neutral-400" />
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-55 p-0">
                            <Command>
                                <CommandInput placeholder="Search country..." />
                                <CommandList>
                                    <CommandEmpty>No country found.</CommandEmpty>
                                    <CommandGroup>
                                        {PHONE_COUNTRIES.map((country) => (
                                            <CommandItem
                                                key={country.code}
                                                value={country.label}
                                                onSelect={() => {
                                                    onCountryChange(country.code);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check />
                                                {country.label} ({country.dialCode})
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                </div>

            </div>
        );

    }
);