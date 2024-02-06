/// <reference lib="deno.ns" />
import * as esbuild from 'https://deno.land/x/esbuild@v0.19.12/mod.js';
import { green } from 'https://deno.land/std@0.211.0/fmt/colors.ts';
import { parseArgs } from 'https://deno.land/std@0.211.0/cli/parse_args.ts';

const args = parseArgs<{
  watch: boolean | undefined,
  develope: boolean | undefined,
  logLevel: esbuild.LogLevel
}>(Deno.args);

console.log('Build process started.');

const tsConfig : esbuild.BuildOptions = {
  allowOverwrite: true,
  logLevel: args.logLevel ?? 'info',
  legalComments: args.develope ? 'inline' : 'none',
  color: true,
  minify: !args.develope ?? true,
  outfile: './dist/bundle.min.js',
  entryPoints: [
    './src/index.ts'
  ],
  bundle: true,
  platform: 'node',
  target: 'node20'
}

const timestampNow = Date.now();

if (args.watch) {
  esbuild.context(tsConfig).then((context) => context.watch());
} else {
  esbuild.build(tsConfig).then(() => {
    console.log(green(`Build process finished in ${(Date.now() - timestampNow).toString()}ms.`));
    esbuild.stop();
  })
}
