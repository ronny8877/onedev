# OneDev Tools MCP

This Worker exposes a focused set of OneDev Tools utilities through a stateless Streamable HTTP MCP endpoint:

```text
https://mcp.onedev.tools/mcp
```

## Connect a client

Add this remote server URL in ChatGPT, Codex, Claude, or another MCP-compatible client:

```text
https://mcp.onedev.tools/mcp
```

The server does not require an API key or OAuth. It exposes JSON operations, Base64 and URL transforms, hashes and HMACs, UUID/NanoID/ULID generation, JWT inspection and HMAC verification, CSV and YAML conversions, cron inspection, and time conversion.

## Development

```sh
pnpm mcp:dev
```

Use the endpoint printed by Wrangler and send MCP requests to `/mcp`.

## Deploy

```sh
pnpm mcp:deploy
```

The Worker configuration creates the `mcp.onedev.tools` Custom Domain in the existing `onedev.tools` Cloudflare zone. Deploy fails safely if a conflicting DNS record already exists.

## Privacy

The website tools run locally in the browser. MCP calls are different: the caller sends tool input to the hosted Worker to receive a result. The Worker is intentionally stateless and does not persist tool inputs, outputs, JWTs, or keys. Do not send secrets to any remote service unless you accept that transmission risk.
