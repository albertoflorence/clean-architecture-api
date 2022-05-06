Esse é um [projeto](https://cursoclean-api.herokuapp.com/api-docs/) feito a partir do curso desenvolvido por [Rodrigo Manguinho](https://www.udemy.com/course/tdd-com-mango/) pela Udemy.

## O que tem dentro?

Esse projeto utiliza as seguintes ferramentas:

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Swagger](https://swagger.io/)
- [Docker](https://www.docker.com/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://github.com/typicode/husky)

## Desenvolvimento

Depois de clonar esse projeto, instale as dependências:

```
npm install
```

Então prossiga:

- crie um arquivo .env
- MONGO_URL=

```
npm run dev
```

A url para testar as rotas com o swagger é:

- `http://localhost:8080/api-docs`

## Comandos

- `dev`: inicializa a aplicação no `localhost:8080`
- `build`: cria uma versão para produção
- `start`: inicializa a aplicação usando a versão de produção
- `test`: executa o jest
- `test:watch`: executa o jest em watch mode
- `up`: inicializa o docker-compose
