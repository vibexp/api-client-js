// Main entrypoint: zero-runtime typed fetch client (openapi-fetch) over the
// generated `paths` types. The axios SDK lives at the `./axios` subpath.
import createClient, { type ClientOptions } from "openapi-fetch";

import type { paths } from "./schema.js";

export type { components, operations, paths } from "./schema.js";

/** Default REST API origin. Empty means same-origin / relative requests; override via `baseUrl`. */
export const PRODUCTION_BASE_URL = "";

/**
 * Create a typed VibeXP API client.
 *
 * Defaults to a same-origin (relative) base URL; pass `baseUrl` to point
 * elsewhere (e.g. http://localhost:8080 in development). All other
 * openapi-fetch options (headers, fetch, querySerializer, …) pass through
 * unchanged.
 */
export function createApiClient(options?: ClientOptions) {
  return createClient<paths>({ baseUrl: PRODUCTION_BASE_URL, ...options });
}

export default createApiClient;
