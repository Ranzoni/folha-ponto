# Install dependencies

- npm i express pg @prisma/client -g dotenv-cli
- npm i -D @types/express @types/node ts-node nodemon prisma
- npx tsc --init

# New migration

npx dotenv -e .env -- prisma migrate dev

# Hot to run:

## Build

npm run build

## Run in production

npm start