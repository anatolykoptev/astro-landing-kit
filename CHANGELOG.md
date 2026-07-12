# Changelog

## [0.4.0](https://github.com/anatolykoptev/astro-landing-kit/compare/v0.3.0...v0.4.0) (2026-07-12)


### ⚠ BREAKING CHANGES

* design subpath no longer exports searchComponents, getComponent, listComponents, searchSections, getSection, listSections.

### Fixed

* pre-public-release repo audit — remove pm7 dead weight + private path ([#31](https://github.com/anatolykoptev/astro-landing-kit/issues/31)) ([d68fde4](https://github.com/anatolykoptev/astro-landing-kit/commit/d68fde4762c3bc2e1718d00959a8bcb03b0ef74d))


### Documentation

* rewrite README to industry-standard OSS positioning ([#29](https://github.com/anatolykoptev/astro-landing-kit/issues/29)) ([23a4480](https://github.com/anatolykoptev/astro-landing-kit/commit/23a448075028a9f525f0a651e0dd5711276aa901))

## [0.3.0](https://github.com/anatolykoptev/astro-landing-kit/compare/v0.2.1...v0.3.0) (2026-07-12)


### ⚠ BREAKING CHANGES

* npm package name changes @krolik/landing-kit -> astro-landing-kit (unscoped — the @krolik npm scope belongs to a different, unrelated npm account, confirmed via 'npm org ls krolik'). GitHub repo already renamed anatolykoptev/landing-kit -> anatolykoptev/astro-landing-kit (auto-redirects old git remote URLs). Consumers must update their dependency spec to the new repo path; existing github: URLs keep working via GitHub's redirect but should not be relied on long-term.
* **deps:** v0.3.0+ requires the consumer's own astro to be ^7.0.0 (peer-required by @astrojs/svelte@9 / @astrojs/mdx@7, pulled in by PR #22's Astro 6->7 bump). Closes the PR #22 review's open question ("does any consumer-side compat matrix need the same Astro 7 note tracked?") and correctly types the prior merge for release-please: that commit landed as build(deps): (hidden, no version bump) when the real-world impact is consumer-breaking — no release PR opened as a result. This commit's fix(deps)! type + BREAKING CHANGE footer is the correction; release-please will now cut 0.3.0 (bump-minor-pre-major).

### Added

* rename package to astro-landing-kit, publish to npm via OIDC ([#26](https://github.com/anatolykoptev/astro-landing-kit/issues/26)) ([9051235](https://github.com/anatolykoptev/astro-landing-kit/commit/90512350dde2455df822cddb6d9ba9c1156cf821))


### Fixed

* **deps:** document Astro 7 consumer-compat requirement ([#24](https://github.com/anatolykoptev/astro-landing-kit/issues/24)) ([832cc44](https://github.com/anatolykoptev/astro-landing-kit/commit/832cc44c23f53e9bd798d3b7130c213af71ad494))


### Documentation

* sync package name references to astro-landing-kit ([#28](https://github.com/anatolykoptev/astro-landing-kit/issues/28)) ([bdebd73](https://github.com/anatolykoptev/astro-landing-kit/commit/bdebd738c1eb2bc330fd2161362795325d0e6186))

## [0.2.1](https://github.com/anatolykoptev/landing-kit/compare/v0.2.0...v0.2.1) (2026-07-12)


### Added

* Astro integration — auto-import DESIGN.md theme ([7769551](https://github.com/anatolykoptev/landing-kit/commit/77695516725acf28cc89dde0baefdbf8f3a9083e))
* **blog:** export utils/* + types + add PostShell composable wrapper ([dff560f](https://github.com/anatolykoptev/landing-kit/commit/dff560fac64c4b86f262eed3cc868ad41c8bf6bd))
* content provider types and interface ([7d3694d](https://github.com/anatolykoptev/landing-kit/commit/7d3694d8814efa5bcb35feba7737bfe9e58b5667))
* design search bridge — list, load, search designs ([d608d33](https://github.com/anatolykoptev/landing-kit/commit/d608d33a76dcff7e97863da950353993606d3af6))
* Directus content adapter (from piter-now) ([63f57d7](https://github.com/anatolykoptev/landing-kit/commit/63f57d782fc95bd072217271dbafa6a8cada80fd))
* export design module from package.json ([71b3132](https://github.com/anatolykoptev/landing-kit/commit/71b3132d7cf74fb35f3fbf5b9f07a053bf459702))
* export pm7 catalog + section recipes from design module ([c4e4ab4](https://github.com/anatolykoptev/landing-kit/commit/c4e4ab414395500d34ac97e3a909ecd101a4131f))
* export vendor/integration for consumer sites ([33fcdcf](https://github.com/anatolykoptev/landing-kit/commit/33fcdcf0e2ee6fc45ec1e6f15378aea3b7706673))
* **favicons:** rabbit ears editorial-warm palette ([#10](https://github.com/anatolykoptev/landing-kit/issues/10)) ([45f42c3](https://github.com/anatolykoptev/landing-kit/commit/45f42c37b96793ddacddc903b01c4cbf704ad477))
* fork AstroWind as @krolik/landing-kit base ([82ad2a1](https://github.com/anatolykoptev/landing-kit/commit/82ad2a19405c3a051188afaecba4b0caebd86eca))
* form protection — honeypot, CSRF, webhook sender ([d194dd8](https://github.com/anatolykoptev/landing-kit/commit/d194dd871478f231500514add55baa468ae1c8c8))
* JSON content adapter with demo landing page ([6cfa96a](https://github.com/anatolykoptev/landing-kit/commit/6cfa96a758974e3063cf4860db17e06e1006c86b))
* JSON-LD builder with Organization, Person, FAQPage, SoftwareApp ([1c0e6c7](https://github.com/anatolykoptev/landing-kit/commit/1c0e6c76ee8b93bc95b0eff64251815ed97b75d5))
* Phase 2 — DESIGN.md parser + Tailwind [@theme](https://github.com/theme) generator ([9934eb2](https://github.com/anatolykoptev/landing-kit/commit/9934eb2dc4b5532b546f3e9f826a2e24b12f7772))
* pm7 bridge CSS + theme generator overrides ([8bf546c](https://github.com/anatolykoptev/landing-kit/commit/8bf546c0873f35322599a754ae16e073dcb1a908))
* pm7 component catalog with search ([51f6fec](https://github.com/anatolykoptev/landing-kit/commit/51f6feca46e6cd95b2bacfc3c7c162de468dc47a))
* section recipes — 10 pre-composed landing page sections ([21824b1](https://github.com/anatolykoptev/landing-kit/commit/21824b126d443b653537f45d64c2894e983b3d27))
* smart dark/light mode resolver from color roles ([884ada7](https://github.com/anatolykoptev/landing-kit/commit/884ada799a45b271070c6ff053dce615ba75667c))
* **styles:** canonical 8-point spacing system + one-clamp section rhythm ([#15](https://github.com/anatolykoptev/landing-kit/issues/15)) ([80d63d8](https://github.com/anatolykoptev/landing-kit/commit/80d63d85357870d03fe063e39f5d80e6c699cb26))
* Svelte islands — ContactForm, FaqAccordion, StatsCounter ([022d0ce](https://github.com/anatolykoptev/landing-kit/commit/022d0cedea63f10f9bd0d76de10bac82cb2a254b))
* sw versioning integration ([#19](https://github.com/anatolykoptev/landing-kit/issues/19)) ([2207ebe](https://github.com/anatolykoptev/landing-kit/commit/2207ebe17e259e55ce745b77686610b88d2152da))
* Tailwind CSS configuration update ([13ab43d](https://github.com/anatolykoptev/landing-kit/commit/13ab43d4c43cbecf61bf7bc4ca08070c037f03ef))
* **widgets:** v0.2.0 — layout variants, align prop, semantic tokens, animate opt-in ([#9](https://github.com/anatolykoptev/landing-kit/issues/9)) ([3d3ac31](https://github.com/anatolykoptev/landing-kit/commit/3d3ac314f7f34df2335e8b03268c9f597595a723))


### Fixed

* consumer-build deps, design-module crash + silent-zero-colors, rssAriaLabel ([0cbbe57](https://github.com/anatolykoptev/landing-kit/commit/0cbbe57f0fda04d99ac6f76898112bd7eeaf112f))
* **deps:** move consumer-build deps out of devDependencies ([0512f9c](https://github.com/anatolykoptev/landing-kit/commit/0512f9cbe0773ddd5e5e917d5b8283a131e49176))
* **deps:** replace dead @astrolib/seo with astro-seo ([#21](https://github.com/anatolykoptev/landing-kit/issues/21)) ([944877c](https://github.com/anatolykoptev/landing-kit/commit/944877c431e694524f94db62b15ef6cac4350ccb)), closes [#20](https://github.com/anatolykoptev/landing-kit/issues/20)
* **design:** stop apply.ts CLI firing on import; fail loudly on unparseable DESIGN.md ([e91f5e8](https://github.com/anatolykoptev/landing-kit/commit/e91f5e8875b38feeb7620b14d9d7a674dd8533d5))
* **design:** wire DESIGN.md → --aw-color-* theme pipeline end-to-end ([#14](https://github.com/anatolykoptev/landing-kit/issues/14)) ([9d78e32](https://github.com/anatolykoptev/landing-kit/commit/9d78e3213f5757e2300c12a8ead138a0c02eadff))
* **exports:** drop double .css suffix in styles/* wildcard ([#8](https://github.com/anatolykoptev/landing-kit/issues/8)) ([591d52c](https://github.com/anatolykoptev/landing-kit/commit/591d52cb9add4de0bab9d99a36360d4760e04e0e))
* **ItemGrid:** configurable description separator, default middot not em-dash ([396309c](https://github.com/anatolykoptev/landing-kit/commit/396309cca0e47f3d96de3261cc247c96c71c850e))
* PageLayout main landmark + token/color leaks (kit-side review fixes) ([#6](https://github.com/anatolykoptev/landing-kit/issues/6)) ([9e0c911](https://github.com/anatolykoptev/landing-kit/commit/9e0c91169a6d4bf19f6f252a3e6d9d5988575e02))
* **utils/images:** passthrough public-prefix OG image URLs ([#5](https://github.com/anatolykoptev/landing-kit/issues/5)) ([ba8cae0](https://github.com/anatolykoptev/landing-kit/commit/ba8cae0932ac61c7a6e5fe09851f29fee0b14b4a))
* **widgets:** clean up broken default rendering (align, invisible content, rhythm) ([#13](https://github.com/anatolykoptev/landing-kit/issues/13)) ([b09cbb5](https://github.com/anatolykoptev/landing-kit/commit/b09cbb5eca6000f84b1e6fcaad081d5d946bd69f))
* **widgets:** navAriaLabel/label override props for Header/ToggleMenu a11y strings ([1bac30f](https://github.com/anatolykoptev/landing-kit/commit/1bac30f1d06aa726bdf19940d8b0b182140a4f1a))
* **widgets:** navAriaLabel/toggleMenuLabel override props for Header a11y strings ([b44d750](https://github.com/anatolykoptev/landing-kit/commit/b44d750275a3ea3052f0c31d8de23db88ec0cb37))
* **widgets:** rssAriaLabel override prop for Header RSS-feed link ([773db6d](https://github.com/anatolykoptev/landing-kit/commit/773db6d014a6096a56b1c5a9086ae9c6f4af8ffe))


### Changed

* **landing-kit:** go-kit-style modular structure with per-module READMEs ([#4](https://github.com/anatolykoptev/landing-kit/issues/4)) ([927edfd](https://github.com/anatolykoptev/landing-kit/commit/927edfdfb0a94b963ecc5e80a49087ae5b66d519))
* strip landing-kit to minimal composable primitives + fix review BLOCKERS ([#3](https://github.com/anatolykoptev/landing-kit/issues/3)) ([e34a4e4](https://github.com/anatolykoptev/landing-kit/commit/e34a4e476bfa8d8dcc31fbcf337eab5c191065b1))


### Documentation

* mark Phase 1 as complete in roadmap ([e4287c5](https://github.com/anatolykoptev/landing-kit/commit/e4287c55f7d1c3ed32f72850c1a2845f62a4192d))
* Phase 2 complete ([f6cf9d0](https://github.com/anatolykoptev/landing-kit/commit/f6cf9d00ccf888c22a5e71cb345107c3cfbac8ae))
* Phase 3a complete, add Phase 3b experience memory + fix import paths ([078a9c9](https://github.com/anatolykoptev/landing-kit/commit/078a9c98af025f037f35c4ec3cf79dec7ebd6888))
* **README:** note recent kit changes (PR [#4](https://github.com/anatolykoptev/landing-kit/issues/4) [#5](https://github.com/anatolykoptev/landing-kit/issues/5) [#6](https://github.com/anatolykoptev/landing-kit/issues/6)) ([#7](https://github.com/anatolykoptev/landing-kit/issues/7)) ([5de4a3e](https://github.com/anatolykoptev/landing-kit/commit/5de4a3eecdddecab357abc3309cc5811cbab7182))
* update roadmap — Phase 2 core done ([7de0754](https://github.com/anatolykoptev/landing-kit/commit/7de075441e932108e234cd7026366adc877f53f4))
