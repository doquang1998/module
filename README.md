` import { Button } from "package-academiclabs";`

build update package : npm run rollup-build-lib

npm run storybook run debug local storybook

# build and deploy to prod:
- checkout to prod branch
- git pull uat
- resolve conflic by add two dist file
- copy tailwind.config.ts to another file then delete tailwind.config.ts
- run: `npm run rollup-build-lib`
- create new tailwind.config.ts file then paste content
- git add .
- git commit -m "..."
- git push origin prod
# build and deploy to uat
- delete dist folder
- run cmd build: `npm run rollup-build-lib`
- upgrade version of package in package.json
- commit code then re-build project use