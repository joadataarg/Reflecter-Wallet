'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    getIdToken
} from 'firebase/auth';
import { auth } from '../firebase/config';

export type UseFirebaseAuthReturn = {
    user: User | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
};

export const useFirebaseAuth = (): UseFirebaseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign in failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            await firebaseSignOut(auth);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign out failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getToken = useCallback(async () => {
        if (!auth.currentUser) return null;
        return await getIdToken(auth.currentUser);
    }, []);

    return {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        getToken,
    };
};
