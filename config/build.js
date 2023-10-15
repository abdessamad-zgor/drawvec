await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './public/build'
});
