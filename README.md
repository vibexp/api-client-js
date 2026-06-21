# @vibexp/api-client

Typed TypeScript client for the VibeXP REST API, generated from the OpenAPI
spec ([`backend/openapi.yaml`](https://github.com/vibexp/vibexp) → Redocly
bundle) at publish time. Generated code is **not** committed — every published
version is built from a pinned backend ref, so the package version always
reflects a real API contract.

- **Main entrypoint** — `openapi-typescript` types + an `openapi-fetch`
  client factory (zero runtime overhead, native `fetch`)
- **`./axios` entrypoint** — a full SDK generated with `@hey-api/openapi-ts`
  (one named function per `operationId`; consumers must install
  `axios >= 1.6.0` themselves — see below)

## Install

Published to the public npm registry — no auth or scope config needed:

```sh
npm install @vibexp/api-client   # pin an exact version
```

## Usage — fetch (frontend)

```ts
import { createApiClient } from "@vibexp/api-client";

const client = createApiClient({ baseUrl: "https://api.vibexp.io" });
// const client = createApiClient({ baseUrl: "http://localhost:8080" }); // dev

const { data, error } = await client.GET("/api/v1/teams");
const created = await client.POST("/api/v1/{team_id}/feed-items/{item_id}/replies", {
  params: { path: { team_id, item_id } },
  body: { content: "..." },
});
```

`paths`, `components`, and `operations` types are exported for standalone use.

## Usage — axios (CLI / Node)

Consumers of this entrypoint must declare `axios >= 1.6.0` as their **own
dependency** — importing `./axios` without it fails at module resolution.
axios is intentionally not declared as a dependency here so fetch-only
consumers don't pull it (and its Node-only transitives) in.

```ts
import { client, getMe, listTeams } from "@vibexp/api-client/axios";

client.setConfig({ baseURL: "https://api.vibexp.io", headers: { Authorization: `Bearer ${apiKey}` } });

const me = await getMe();
const teams = await listTeams();
```

## Versioning & release

Publishing is **release-driven**: creating a GitHub Release with a `v*` tag
(e.g. `v0.1.0`) runs the **Publish** workflow
(`.github/workflows/publish.yml`), which:

1. derives the npm version from the tag (`v0.1.0` → `0.1.0`),
2. checks out `vibexp/vibexp` at the **same tag** and regenerates the client,
3. **runs the smoke typecheck (the generation gate) and only publishes if it passes**, then
4. publishes to the public npm registry.

The version mirrors the backend release the client was generated from, so
consumers can tell which API contract a client targets. Pin exact versions in
consumers.

> Manual override: the workflow can also be run via **workflow_dispatch** with
> optional `version` / `backend_ref` inputs — handy for the first publish before
> the backend is tagged (set `backend_ref=main`).

Requires the repo secret `NPM_TOKEN` (an npm automation token with publish
rights to the `@vibexp` scope).

## Development

Generation reads the backend OpenAPI spec. Point `VIBEXP_SPEC` at a local
`openapi.yaml`, or check the backend repo out at `spec-src/`:

```sh
git clone https://github.com/vibexp/vibexp spec-src   # provides spec-src/backend/openapi.yaml
npm install
npm run smoke   # bundle spec → generate types + axios SDK → tsc build → typecheck smoke/

# or point at an existing checkout:
VIBEXP_SPEC=/path/to/vibexp/backend/openapi.yaml npm run smoke
```

`src/schema.ts` and `src/axios/` are generated (gitignored); the only
hand-written sources are `src/index.ts`, `src/axios-entry.ts` and `smoke/smoke.ts`.
