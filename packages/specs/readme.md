<img src="https://img.shields.io/circleci/build/github/panoply/liquify/circleci-project-setup?token=54a787fdd39139be0add226455eb4d07f34f9d3f&style=flat-square&logo=CircleCI&label=&labelColor=555" align="left" />&nbsp;&nbsp;<img align="left" src="https://img.shields.io/librariesio/release/npm/@liquify/specs?style=flat-square&label=&logoWidth=28&labelColor=555&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCA5LjMzIj48dGl0bGU+bnBtPC90aXRsZT48cGF0aCBkPSJNMCwwVjhINi42N1Y5LjMzSDEyVjhIMjRWMFpNNi42Nyw2LjY2SDUuMzN2LTRINHY0SDEuMzRWMS4zM0g2LjY3Wm00LDBWOEg4VjEuMzNoNS4zM1Y2LjY2SDEwLjY3Wm0xMiwwSDIxLjM0di00SDIwdjRIMTguNjd2LTRIMTcuMzR2NEgxNC42N1YxLjMzaDhabS0xMi00SDEyVjUuMzNIMTAuNjZaIiBzdHlsZT0iZmlsbDojZmZmIi8+PC9zdmc+" />

# @liquify/liquid-language-specs

This package is available on the npm registry for modules consumed by the [Liquify](https://liquify.dev) text editor extension/plugin.

**Liquify is proprietary closed source software. The distributed code provided in this package is enigmatic and has been encrypted using an [aes-256-gcm](https://en.wikipedia.org/wiki/Galois/Counter_Mode) algorithm**

## Why?

The [Liquid Language Server](#) requires these Liquid specification variation references to compose a workable AST and provide LSP capabilities to the various Liquify clients.

## What the F\*ck are Liquid Language Specs?

In the context of the Liquid Language Server, variation specifications are just data references that describe Liquid syntax and enable developers to compose formal grammars. A template language like Liquid exists in a multitude of variations that extend upon its default [standard](https://shopify.github.io/liquid/) variation. Due to this versatile nature and endless implementations in which Liquid exists supporting intelliSense capabilities in text editors is made possible by providing the Language Server with project specific variation reference data.

## Author

🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com) <img align="right" src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff" />
