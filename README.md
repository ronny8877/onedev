# OneDev Tools

OneDev Tools is a browser-first collection of developer utilities for JSON, XML, CSV, SQL, JWTs, hashes, cron expressions, IDs, QR codes, image/PDF work, and more.

The public website is [onedev.tools](https://onedev.tools). Website-tool input is processed locally in the browser; the optional hosted MCP server is documented separately in [mcp-server/README.md](mcp-server/README.md).

## Stack

- SvelteKit 2 and Svelte 5
- TypeScript, Vite 7, Tailwind CSS 4, and DaisyUI 5
- Cloudflare Workers deployment via `@sveltejs/adapter-cloudflare`
- pnpm

## Develop

Prerequisites: Node.js 20+ and pnpm.

```sh
pnpm install
pnpm dev
```

The website is then available at `http://localhost:5173`.

```sh
pnpm check       # Svelte and TypeScript checks
pnpm build       # production Cloudflare build
pnpm preview     # preview the built Worker on port 4173
```

## Search and privacy policy

The site deliberately indexes only category hubs, trust pages, and a curated group of substantial tools. Other individual tools return `noindex, follow`; this keeps search focused on pages with distinct utility and supporting content. The policy and sitemap source of truth live in `src/lib/config/indexing.ts`.

## Contributing

Please open an issue or a focused pull request on GitHub. Before submitting code, run `pnpm check` and `pnpm build`. Do not include private tool input, credentials, tokens, or production data in issues, commits, or screenshots.

## Security

Do not report security-sensitive issues in a public GitHub issue. Contact [hello@onedev.tools](mailto:hello@onedev.tools) with enough detail to reproduce the concern safely.

## License

[MIT](LICENSE)
