## Introduction

Development cheatsheet for this project: [README_DEV_CHEATSHEET.md](README_DEV_CHEATSHEET.md)
How to setup this dev kit: [README_DEV_KIT_SETUP.md](README_DEV_KIT_SETUP.md)
Original `Create React App` README: [README_CRA.md](README_CRA.md)

## Table of Contents

<details>

- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [Install](#install)
    - [NOTE: React UI run along side with old PHP UI](#note-react-ui-run-along-side-with-old-php-ui)
- [Deploy](#deploy)
    - [1. Build production release](#1-build-production-release)
    - [2. Do some foo bar thing](#2-do-some-foo-bar-thing)
- [Develop](#develop)
    - [1. Folder structure](#1-folder-structure)
    - [2. New screen with route](#2-new-screen-with-route)
    - [3. State mng with Redux](#3-state-mng-with-redux)
    - [4. Async with redux-saga](#4-async-with-redux-saga)
    - [5. New component code style](#5-new-component-code-style)
- [Development kit setting up](#development-kit-setting-up)

</details>

## Install
```
git clone URL
cd the_cloned_folder
yarn install
yarn start
```

## Deploy

#### 1. Build production release
```
yarn build
```
You will have a `build/` folder.
This is your static web you need to deploy.

>TODO: Containerize this project into Docker 

#### 2. Do some foo bar thing
**Security:** 
You need to disable the source map, 
If you don't, another curios hacker can see your entire source code:
How source map was generated, see `config/webpack.config.prod.js:35`:
```
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
```
So the strategy for disabling source-map is set an 
environment variable on the server / Docker container.
Or another way is run `rm -f build/static/js/*.map` right after the `build`.
Or the best way is disable it right from build process (My choice):
`build.js:8`
```
process.env.GENERATE_SOURCEMAP = 'false';
```




## Develop

#### 1. Folder structure
TODO: Add folder structure guide
**Project structure**
```
my-project-folder/
    build/          --> After `yarn build`, you'll get this folder, run index.html to see you page work.
    config/         --> The folder of official CRA, after `npm eject`
    public/         --> Public template or resource go here, rarely use
    scripts/        --> The folder of official CRA, after `npm eject`
    src/            --> The source code folder, all your work will be here
    typings/        --> The Typescripts definition, was managed by `typings` and my own script `typings-dts-gen`
    package.json    --> Everyone know this file
    README_*.md     --> Need to read all this file before working
    tsconfig.json   --> Typescript good configuration
    typings.json    --> `typings` declaration file, it's like `package.json` for `npm`
    typings-dts-gen --> My script for generating typescript definition `.d.ts` for some node_modules, read more in README_*.md 
```

**Source code structure**
```
src/
    assets/             --> 
    base/               --> Reuse components for all (may be) React project
        auth/               --> Useful component for auth / debug auth
        HttpService/        --> Http helpers useful for working with API
        redux/              --> For redux and saga
        router/             --> For react router
        translation/        --> Translate with i18n on redux, all about translation go here 
    components/         --> Reuse components for this project only
    helpers/            --> Some libs, helpers for this project
    pages/
        */              --> Each page is 1 folder. See **Component structure** bellow for more detail
        Layout.jsx      --> Your layout for all page, you can create some more layout
    polyfill/           --> Some usefull polyfill, some overwrite of JS core, it's diferrent than libs
    unpublish_modules/  --> Do not use this folder, if you can write your own node_modules, plz upload it to npm code pool and install it
    ant-theme-vars.less --> UI Config for Ant design, some file like this will be put here 
    index.js            --> Entry file
    siteConfig.js       --> DEV / PROD static config info
```

**Component structure**
See the `src/components/ProductCategory` for fully structure guide:
```
ProductCategory/
    MockData.js         --> Mock data or fixed data for this component
    [name].jsx          --> The React Component
    [name].module.css   --> The Sass with css module, see the configuration in `config/webpack.config.*.js` for detail 
    [name].redux.ts     --> Redux Action + Saga action + Redux Reducer declaration. Recommend Typescript for logic files
    [name].saga.js      --> Saga worker and watcher 
    [name]Type.ts       --> Typescript type definition
```

**Typings definition structure**
TBW --> Ask me

#### 2. New screen with route
#### 3. State mng with Redux
#### 4. Async with redux-saga
#### 5. New component code style


## Development kit setting up
See the [README_CRA.md](README_CRA.md)

