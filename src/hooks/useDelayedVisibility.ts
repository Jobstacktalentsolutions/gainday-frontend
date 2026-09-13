import { useEffect, useState } from "react";

export function useDelayedVisibility( delayMs = 200) : boolean{
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), delayMs);
        return () => clearTimeout(timeout);
    }, [delayMs]);

    return visible;
}