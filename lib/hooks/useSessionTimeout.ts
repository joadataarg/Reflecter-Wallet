import { useEffect, useCallback, useRef } from 'react';

export const useSessionTimeout = (
    isActive: boolean,
    timeoutMs: number,
    onTimeout: () => void
) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const resetTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (isActive) {
            timerRef.current = setTimeout(() => {
                onTimeout();
            }, timeoutMs);
        }
    }, [isActive, timeoutMs, onTimeout]);

    useEffect(() => {
        if (!isActive) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        // Initial timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isActive, resetTimer]);

    return { resetTimer };
};
