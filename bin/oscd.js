#!/usr/bin/env node
/* eslint-disable no-undef */
// Small executable wrapper that imports the compiled ESM entry and runs it.
import { main } from "../dist/oscd.js";

const args = process.argv.slice(2);
main(args).catch((err) => {
  console.error(err);
  process.exit(1);
});
