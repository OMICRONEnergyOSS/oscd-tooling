// configs/ncurc.config.js
//
// Shared default configuration for `npm-check-updates` (ncu), used by `oscd updates`.
//
// This is only a *default*. Consuming projects can:
//   - drop their own `ncurc.config.js` at the repo root to fully replace it, or
//   - import and spread this config to extend it with project-specific overrides:
//
//       import base from '@omicronenergy/oscd-tooling/configs/ncurc.config.js';
//       export default { ...base, reject: ['some-pinned-package'] };
//
// Policy: packages default to ncu's own `latest` target. A short, curated list of
// packages is held to `minor` (patch/minor only, no major bump) because a major bump
// is *known* to break the toolchain today, or because the package is part of a family
// that must be upgraded together, deliberately, after testing. Remove an entry once the
// underlying constraint has been resolved and the upgrade has been verified.
const HELD_BACK = {
  // @typescript-eslint/{parser,eslint-plugin} declare
  // `"typescript": ">=4.8.4 <6.1.0"` as a peer dependency (the upper bound is
  // exclusive, so 6.1.0+ - and the 7.x native/Go compiler already published as
  // `latest` on npm - are both unsupported). We're pinned to the newest version
  // that satisfies that range (6.0.x) via a `~` range in package.json, so only
  // patch releases within 6.0.x are safe to take automatically. Revisit (and
  // relax back to `latest`) once typescript-eslint supports TS 6.1+/7.x.
  typescript: "patch",

  // The @web/test-runner* and @web/dev-server* family is versioned as a coordinated
  // set: every @web/test-runner-* package requires @web/test-runner-core@^1, and
  // @web/dev-server-polyfill@2 requires @web/dev-server@^1. Bumping one package to its
  // new major without the rest breaks the toolchain. Upgrade the whole group together,
  // deliberately, after testing - not piecemeal via `latest`.
  "@web/test-runner": "minor",
  "@web/test-runner-commands": "minor",
  "@web/test-runner-playwright": "minor",
  "@web/test-runner-visual-regression": "minor",
  "@web/dev-server": "minor",
  "@web/dev-server-esbuild": "minor",
  "@web/dev-server-polyfill": "minor",
  "@web/rollup-plugin-html": "minor",
  "@web/rollup-plugin-import-meta-assets": "minor",

  // @open-wc/testing 5.x is developed and tested against the modern-web 1.0 family
  // above; hold it back until that group moves together.
  "@open-wc/testing": "minor",
};

export default {
  target: (packageName) => HELD_BACK[packageName] ?? "latest",
};
