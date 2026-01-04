/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Setup file for Vitest
 * Configures global mocks and polyfills for the SDK testing environment
 */

// Mock del Crypto API para entornos Node/jsdom
if (typeof global !== 'undefined' && !global.crypto) {
    // @ts-ignore
    global.crypto = {
        subtle: {
            importKey: vi.fn(),
            deriveBits: vi.fn(),
            deriveKey: vi.fn(),
            exportKey: vi.fn(),
        },
        getRandomValues: (arr: any) => {
            for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
            return arr;
        },
    };
}

// Mocks globales de Firebase para evitar errores de inicialización en tests
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
    getIdToken: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    collection: vi.fn(),
}));
