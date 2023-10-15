import {build} from "esbuild";

build({
  entryPoints: ["../src/index.ts"],
  bundle: true,
  outdir: './public/build'
})
  .then(()=>console.log("build finished..."))
  .catch(err=>console.error(err))
