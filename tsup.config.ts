import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
    entry: ['lib/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: !options.watch,
    external: [
        'react',
        'react-dom',
        'firebase',
        'firebase/auth',
        'firebase/firestore',
        '@chipi-stack/nextjs',
    ],
    outDir: 'dist',
    banner: {
        js: '/** OpenTheDoorz SDK v1.0.0 */',
    },
}));
