# to start this app
## create .env in the root directory
## add this variables

#### PORT
#### SECRET
#### DATABASE_URL
#### FROM
#### APP_PASSWORD

### using yarn
```sh
yarn
yarn migrate:development
yarn dev
```

### using docker
```sh
docker build -t wst .
docker run -it --rm --name running-wst -p 3000:3000 wst
```
