#!/usr/bin/env node

import { EOL } from "node:os";
import { exit, stdout } from "node:process";
import { parseArgs } from "node:util";
import { pipeline } from "node:stream/promises";

import { uuidv8 } from "uuidv8";

// check arguments
let options = undefined;
try {
  options = parseArgs({
    options: {
      count: { type: "string", short: "n" },
      help: { type: "boolean", short: "h" },
    },
  }).values;

  if (options.count && !/^[0-9]+$/.test(options.count)) {
    throw new TypeError("Invalid argument to option '-n, --count <value>'");
  }
} catch (e) {
  console.error(`Error: ${e.message ?? e}`);
  exit(1);
}

// print usage if requested
if (options.help) {
  console.log("Usage: uuidv8 [-n <count>]");
  exit(0);
}

// write `-n` uuidv8 strings to `stdout`
const count = parseInt(options.count ?? "1", 10);
await pipeline(
  (function* (count) {
    for (let i = 0; i < count; i++) {
      yield uuidv8() + EOL;
    }
  })(count),
  stdout,
);
