<img src="https://brand.zesty.io/zesty-io-logo.svg" alt="zesty logo" width="200">

# Zesty.io Explorer

Website/App Overlay Guide for Editing Zesty.io Content

## Overview

Is that the explorer will be a website overlay tool that will guide the user around the data that loads on the page relative to the zesty content management system. The tool will have tabs for searchable on page data, full site navigation, inline editing, website and page health, metadata explorer, image optimization scanning, broken link scanning.

## How to Implement

The tool should be built in compiled JavaScript and execute in plain JavaScript so it can run over any installation of zesty, whether it's parsley templating, next js, nuxt, or any custom build.

## Distribution

It should be distributed over npm package manager and yarn, it should also be able to be manually installed from a CDN link.

Using NPM

`npm install @zesty-io/explorer`

Using CDN

-  copy the script tag below and paste it in the head of your main.html file

```
     <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/gh/zesty-io/explorer@latest/dist/explorer.production.js"
      defer="defer"
    ></script>

```

Or

```
     <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/gh/zesty-io/explorer@v1.1.12/dist/explorer.production.js"
      defer="defer"
    ></script>

```

Importing

```
import { ZestyExplorer } from   '@zesty-io/explorer';
```

## Explorer Sections

-  Page Data Explorer
-  Full Site Navigation and Explorer
-  Inline Editing (phases)
-  Website and Page Health
-  Metadata
-  Link Scanning
-  Optimization Scanning

## Publishing to NPM

Developer must have access to `zestyionpm` account

`npm publish --access public`

## Deploying the cdn

-  `git checkout cdn`
-  run `yarn release` or `npm run release`

#### In the prompts

-  press 'n' to not publish to npm then the rest press 'y'

#### It will open new window

-  press ok
-  then update the readme version of cdn to current version

#### This is your current updated script tag / cdnjs

```
     <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/gh/zesty-io/explorer@${RELEASE_VERSION_CDN_BRANCH}/dist/explorer.production.js"
      defer="defer"
    ></script>

```

## Testing using NPM

-  On origin/main

```
git checkout -b explorer-dev-test
```

-  Edit `package.json` change the name to @username/explorer-dev-test
-  Edit `package.json` increment the version number per publish
-  Npm publish --access public
-  In your react/next/app

```
import { ZestyExplorer } from   '@username/explorer-dev-test';
```

## Testing Locally using NextJs/CRA

-  Clone the [Zesty Explorer](https://github.com/zesty-io/explorer.git "Zesty Explorer") and [NextJs App](https://github.com/zesty-io/nextjs-website.git "Zesty Nextjs-website") on the same folder

-  cd in the Nextjs app folder
-  Create .env file with a value `NEXT_PUBLIC_DOMAIN_OVERRIDE=https://www.zesty.io`
-  run `npm install`
-  cd in the Zesty Explorer folder
-  run `yarn install`
-  run `npm link ../${YOUR_NEXTJS_APP_FOLDER}/node_modules/react/`
-  run `yarn build`
-  run `yarn start`
-  cd in the Nextjs app folder
-  run `npm i ../${YOUR_EXPLORER_FOLDER}`

#### You can now import the ZestyExplorer in your next js app 🎉🎉🎉

```
import { ZestyExplorer } from '@zesty-io/explorer';
```

-  run `npm run dev`
