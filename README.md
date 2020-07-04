# tempWeb

Template for Web Development

## Summary

- Languages
  - HTML
    - HTML Template engine: lit-html
  - TypeScript
    - ECMAScript: latest (latest browser supported level)
- Test
  - Jest
    - compile: tsc throught ts-jest
- Lintings
  - Linter: ESLint
    - rules: all recommended
    - target: .js & .ts
    - timing: save in VSCode
  - Formatter: Prettier
    - rules: all default
    - target: all default (only .js & .ts throught ESLint)
    - timing: save in VSCode
- Builds
  - package manager: npm
  - task runner: npm
  - builder/bundler: webpack
    - entry point: HTML
- Editor
  - VSCode

## Additions

bundle insert in head: "html-webpack-injector"

## When use

```
npm outdated
```

## Explanations

### ESLint + Prettier

Two choices

1. linting by ESLint with prettier rule config/plugin
2. formatting by Prettier => formatting by ESLint, integrated by prettier-eslint

This template choose 1st method.

#### 1st method: ESLint with Prettier rules

eslint-config-prettier: turn OFF eslint rules which is not compatible with Prettier  
eslint-plugin-prettier: introduce prettier formatting algorithm (processor) in ESLint

Configure eslint rules with eslint-config-prettier's "prettier" in "extends" property.  
Introduce prettier processor with eslint-plugin-prettier's "prettier" in "plugins" property and enable it by "prettier/prettier": "error" in "rules".  
In summary, below .eslintrc become like below.

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

Fortunatelly, eslint-plugin-prettier provide "recommended configuration", which provide implicit several configs, through "plugin:prettier/recommended" in "extends". [prettierOfficial][pretes1]  
This means that below .eslintrc result in totally same result with above .eslintrc.  
[pretes1]:https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration

```json
{
  "extends": ["plugin:prettier/recommended"]
}
```

This utility is implicit sugar config, so both library should be install.

##### + TS-ESLint

[official page](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage)

### Linting/Formatting timing

Except for .js & .ts, Prettier format codes throught VSCode extention.  
For linting and formatting .js/.ts, VSCode's onSave formatting setting turned off by language.  
Alternatively, ESLint do them onSave through VSCode extention.
