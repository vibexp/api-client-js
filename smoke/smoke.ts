// Consumer smoke test: typechecks a realistic usage of both entrypoints
// against the freshly generated types. It fails compilation if generation
// produced empty/broken output (missing paths, missing operations, or an
// SDK function disappearing), which is exactly the gate the publish
// workflow needs before pushing a version to GitHub Packages.
import { createApiClient, type paths } from "../src/index.js";
import { client, getMe, listTeams } from "../src/axios-entry.js";

// --- type-level assertions -------------------------------------------------

type Expect<T extends true> = T;

// Known operations must exist with their methods.
type _TeamsGetExists = Expect<
  paths["/api/v1/teams"]["get"] extends Record<string, unknown> ? true : false
>;
type _AgentCreateExists = Expect<
  paths["/api/v1/{team_id}/agents"]["post"] extends Record<string, unknown>
    ? true
    : false
>;

// A known response schema must be an object type, not unknown/any fallback.
type MeResponse =
  paths["/api/v1/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
type _MeHasUser = Expect<MeResponse extends Record<string, unknown> ? true : false>;

// --- openapi-fetch entrypoint ----------------------------------------------

export async function smokeFetchClient(): Promise<void> {
  const client = createApiClient({ baseUrl: "http://localhost:8080" });
  const { data, error } = await client.GET("/api/v1/teams");
  if (error !== undefined) {
    return;
  }
  // data is the typed 200 body of GET /api/v1/teams.
  void data;
}

// --- axios entrypoint --------------------------------------------------------

export async function smokeAxiosClient(): Promise<void> {
  client.setConfig({ baseURL: "http://localhost:8080" });
  const me = await getMe();
  void me.data;
  const teams = await listTeams();
  void teams.data;
}
