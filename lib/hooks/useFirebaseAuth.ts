'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    getIdToken
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { logger } from '../utils/logger';
import { createWalletError, ErrorCode } from '../utils/errors';

export type UseFirebaseAuthReturn = {
    user: User | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string) => Promise<User | null>;
    signIn: (email: string, password: string) => Promise<User | null>;
    signInWithGoogle: () => Promise<User | null>;
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
            if (user) {
                logger.debug('User session active', { uid: user.uid });
            }
        });

        return () => unsubscribe();
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            logger.audit('User signed up', { email });
            return userCredential.user;
        } catch (err) {
            const walletError = createWalletError(ErrorCode.AUTH_FAILED, { email }, err);
            setError(walletError.message);
            logger.error('Sign up failed', { code: walletError.code });
            throw walletError;
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            logger.debug('User signed in', { email });
            return userCredential.user;
        } catch (err) {
            const walletError = createWalletError(ErrorCode.AUTH_INVALID_CREDENTIALS, { email }, err);
            setError(walletError.message);
            logger.error('Sign in failed', { email });
            throw walletError;
        } finally {
            setLoading(false);
        }
    }, []);

    const signInWithGoogle = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            logger.debug('User signed in with Google', { email: userCredential.user.email });
            return userCredential.user;
        } catch (err: any) {
            const walletError = createWalletError(ErrorCode.AUTH_FAILED, { method: 'google' }, err);
            setError(walletError.message);
            logger.error('Google sign in failed', { error: err.message });
            throw walletError;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const uid = auth.currentUser?.uid;
            await firebaseSignOut(auth);
            logger.audit('User signed out', { uid });
        } catch (err) {
            const walletError = createWalletError(ErrorCode.AUTH_FAILED, {}, err);
            setError(walletError.message);
            logger.error('Sign out failed');
            throw walletError;
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
        signInWithGoogle,
        signOut,
        getToken,
    };
};
