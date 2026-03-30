import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: 'esm',
    target: 'node24',
    platform: 'node',
    clean: true,
    splitting: false,
    dts: false,
    sourcemap: true,
    noExternal: [/@vodhub\/.+/]
});
