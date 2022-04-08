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

- add this in the body of main.html file

```
   <div id="zesty-explorer"></div>
```

- copy the script and link tag below and paste it in the head of your main.html file

```
   <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/gh/zesty-io/explorer@main/build/static/js/main.min.js"
      defer="defer"
    ></script>
    <link
      href="https://cdn.jsdelivr.net/gh/zesty-io/explorer@main/build/static/css/main.min.css"
      rel="stylesheet"
    />
```

`CND LINK`

## Explorer Sections

- Page Data Explorer
- Full Site Navigation and Explorer
- Inline Editing (phases)
- Website and PAge Health
- Metadata
- Link Scanning
- Optimization Scanning
