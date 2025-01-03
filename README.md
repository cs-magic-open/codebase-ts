
![CS Magic Banner](assets/branding/cs-magic/neurora_banner_v1_white_black.jpg)

<div align="center">
<h1>CS Magic TypeScript Codebase</h1>
</div>

## Preparation

- configure env （refer to `env.sample`）
- configure dependencies:
```shell
packages=(
 jq go # for wechaty-puppet
 bash  # for `shopt -s globstar` since the default base is too old on Mac
 nvm   # for configuring node/npm/yarn
 postgresql # brew services start postgresql, and install nanoid, pgvectors, see in scripts/post-install.sh
 redis # brew services start redis
)
brew install "${packages[@]}"
```
- prepare yarn: `NV=18.19.0 && nvm install $NV && nvm use $NV && npm i -g yarn`
- `export PATH=$(pwd)/node_modules/.bin:$PATH` (sometimes important!)
- postgresql vector initialization
  ```shell

  ```
- installation: `yarn` (db migration will auto exec)
  ```shell
  yarn workspaces foreach -pA add -D npm-run-all jest @types/jest ts-patch typescript-transform-paths copyfiles
  yarn workspaces foreach -pA --include "packages/frontend/*" --include "packages/backend/*" \
    add -D @cs-magic/ts-config @cs-magic/eslint-config @cs-magic/prettier-config @cs-magic/tailwindcss-config  
  ```

## References 

- [Tech](__docs__/tech.md)
- [Finished Todo](__docs__/finished-todo.md)

## Upstreams

We would also like to give thanks to open-source projects that make CS-Magic possible:

- ReactJS - The library for web and native user interfaces.
- NextJS - The React Framework for the Web.
- Vite - Next generation frontend tooling.
- ElectronJS - Build cross-platform desktop apps with JavaScript, HTML, and CSS.
- Jotai - Primitive and flexible state management for React.
- Other upstream dependencies.

Thanks a lot to the community for providing such powerful and simple libraries, so that we can focus more on the implementation of the product logic, and we hope that in the future our projects will also provide a more easy-to-use knowledge base for everyone.

## Authors

- [Mark](https://github.com/markshawn2020)
 
