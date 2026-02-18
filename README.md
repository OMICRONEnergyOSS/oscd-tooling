# @omicronenergy/oscd-tooling (prototype)

Minimal prototype of the `oscd` centralized tooling CLI that exposes shared configs and commands.

## The idea

All of the OpenSCD plugins need to have the same tooling - ideally, built, tested and bundled with the same versions of tools.
This module aims to move as much tooling boiler plate from the individual projects to this module. Developers then don't need to manage each of the plugins tooling chain. When tool updates require changes to configuration, this now happens in the one place, allowing plugin developers upgrade to the latest version of this module without needing to change anything in their project.

This should result in:

- dramatically reduced set of dependencies in each project
- less config files in each repo
- consistency accross plugins - once you know how everything is in one plugin, you know how it is in all the others (assuming their all using the this module!)

## Additional Features

### Plugin Doctor

By running `oscd doctor` the tool will check for specific configurations, tools and versions and point out anything you may need to change.
-- DISCLAIMER -- this is currently "proof of concept" the actual rule currently in place are dribble - its skeleton code at best, but hopefully will mature really soon to be helpful when revisiting a project you've not been working on for a time.

Plugin Doctor --fix: Issues which are simple to fix, can be fixed. This is even more vague right now -

##

## What this contains

- `bin/oscd.js` — tiny CLI wrapper that runs tools from the calling project, pointing them at shared configs.
- `configs/` — shared config files: `base.tsconfig.json`, `eslint.config.js`, `rollup.config.js`, `commitlint.config.js`
- `core/` — helper utilities used by the CLI

## Quick start (experimenting locally)

1. Download and extract this package.
2. In a consuming project run:
   ```json
   // package.json
   {
     "devDependencies": {
       "@omicronenergy/oscd-tooling": "file:../path/to/oscd-tooling"
     },
     "scripts": {
       "lint": "oscd --lint",
       "test": "oscd --test",
       "build": "oscd --build"
     }
   }
   ```
3. From the consuming project run `npm install` and then `npm run lint`. The CLI will run ESLint on your project using the shared config.

## Notes & design choices

- The CLI executes tools with `process.cwd()` as the working directory, so it analyzes the consuming repo.
- Config files are provided under `configs/`. You can reference them from your local project by extending:
  ```json
  // tsconfig.json
  {
    "extends": "node_modules/@omicronenergy/oscd-tooling/configs/base.tsconfig.json",
    "compilerOptions": { "outDir": "dist" }
  }
  ```
- `rollup.config.js` exports a factory function so a consuming repo can `import base from '@omicronenergy/oscd-tooling/configs/rollup.config.js'; export default base({ input: 'src/index.ts' })`

## Limitations

- This is a prototype — so far only lint (and commitlint has been tested).

## Future

When
