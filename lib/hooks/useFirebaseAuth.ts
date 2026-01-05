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
import { logger } from '../utils/logger';
import { createSDKError, ErrorCode } from '../utils/errors';

export type UseFirebaseAuthReturn = {
    user: User | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string) => Promise<User | null>;
    signIn: (email: string, password: string) => Promise<User | null>;
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
            const sdkError = createSDKError(ErrorCode.AUTH_FAILED, { email }, err);
            setError(sdkError.message);
            logger.error('Sign up failed', { code: sdkError.code });
            throw sdkError;
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
            const sdkError = createSDKError(ErrorCode.AUTH_INVALID_CREDENTIALS, { email }, err);
            setError(sdkError.message);
            logger.error('Sign in failed', { email });
            throw sdkError;
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
            const sdkError = createSDKError(ErrorCode.AUTH_FAILED, {}, err);
            setError(sdkError.message);
            logger.error('Sign out failed');
            throw sdkError;
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
