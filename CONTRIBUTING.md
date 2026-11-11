# Contributing

Issues and pull requests are welcome. Report a security problem privately, as described in
[SECURITY.md](SECURITY.md), not in an issue. By taking part you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Build and test

Node 24.18.0 and npm 11.6.2 are pinned by `.node-version` and `packageManager`.

```sh
npm ci
npm run dev        # local dev server
npm run build      # production build into dist/
npm run check      # astro check (types)
npm test           # vitest run
```

## The gate

The `preflight` workflow runs `npm ci`, `npm run build`, `npm run check` and `npm test` on every pull
request to `master`, then an advisory `impeccable detect` pass over `dist/`. Run the first four
locally before you push. A pull request that only touches Markdown, `docs/`, licences or the issue and
pull-request templates skips the heavy job.

## Commits and releases

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
`refactor:`, `docs:`, `chore:` ...); a breaking change uses `!` or a `BREAKING CHANGE:` footer.
release-please reads them to open the release pull request, so do not tag, bump the version or edit
`CHANGELOG.md` by hand.

## Pull requests

- Keep a pull request to one change, with the reason in the description.
- Add or update tests for behaviour you change; a module's README lists its exact exports, so update
  it when the exports change.
- A new public module needs an entry under `exports` in `package.json`.
- `widgets/*` are prototype scaffolds. Production brand pages compose from `ui/*`; see
  [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) for the layering rules.
- The repository is public: no hostnames, personal paths, account names or tokens in any file.

## Licence

The kit is MIT licensed ([LICENSE.md](LICENSE.md)); contributions are accepted under the same terms.
