// Public surface of the `./axios` subpath. The generated barrel
// (src/axios/index.ts) exports the SDK functions and types but NOT the
// shared client instance, which consumers need for setConfig (baseURL,
// auth headers). Re-export both from one stable entrypoint.
export * from "./axios/index.js";
export { client } from "./axios/client.gen.js";
