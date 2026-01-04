'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';
import { logger } from '@/lib/utils/logger';

interface WalletSessionContextType {
    isSessionActive: boolean;
    encryptKey: string | null;
    toggleSession: (isActive: boolean) => Promise<void>;
    isLoading: boolean;
}

const WalletSessionContext = createContext<WalletSessionContextType | undefined>(undefined);

export function WalletSessionProvider({ children }: { children: ReactNode }) {
    const { user } = useFirebaseAuth();
    const [encryptKey, setEncryptKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Al cerrar sesión o recargar, la clave se limpia automáticamente (seguridad por defecto)
    useEffect(() => {
        if (!user) {
            setEncryptKey(null);
        }
    }, [user]);

    const toggleSession = async (isActive: boolean) => {
        if (!isActive) {
            // Apagar sesión: borrar clave de memoria
            setEncryptKey(null);
            logger.audit('Wallet session deactivated manually');
            return;
        }

        if (!user) {
            logger.error('Cannot activate wallet session: No user');
            return;
        }

        // Encender sesión: derivar clave
        try {
            setIsLoading(true);
            // Aqui usamos la nueva derivación resiliente (sin Firestore forzado)
            const key = await deriveEncryptKey(user.uid);
            setEncryptKey(key);
            logger.audit('Wallet session activated');
        } catch (error) {
            logger.error('Failed to activate wallet session', { error });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WalletSessionContext.Provider
            value={{
                isSessionActive: !!encryptKey,
                encryptKey,
                toggleSession,
                isLoading
            }}
        >
            {children}
        </WalletSessionContext.Provider>
    );
}

export function useWalletSession() {
    const context = useContext(WalletSessionContext);
    if (context === undefined) {
        throw new Error('useWalletSession must be used within a WalletSessionProvider');
    }
    return context;
}
