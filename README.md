<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">API do <strong>adotaPet</strong>, construída com <a href="http://nestjs.com/" target="_blank">NestJS</a> + <a href="https://typeorm.io/" target="_blank">TypeORM</a> + PostgreSQL.</p>

## Setup

```bash
cp .env.example .env      # ajuste os valores se precisar
npm install
docker compose up -d      # sobe o Postgres
npm run start:dev         # API em http://localhost:3000
```

## Rotas

| Método | Rota          | O que faz                                            |
| ------ | ------------- | ----------------------------------------------------- |
| POST   | `/users`      | Cria usuário (hash da senha, e-mail único)            |
| POST   | `/auth/login` | Autentica por e-mail + senha, retorna `access_token`  |

## Features

**Usuário**
- Entidade `User` com `nome`, `email`, `senha`, `role` (`ADMIN`/`FUNCIONARIO`, default `FUNCIONARIO`).
- Validação de payload (`class-validator`): e-mail válido, senha mínima de 6 caracteres.
- E-mail único, senha com hash bcrypt (salt rounds 10).
- `senha` nunca aparece em nenhuma resposta JSON.

**Autenticação**
- Login por e-mail + senha, retorna JWT (`access_token`) com `sub`, `email` e `role`.

**Global**
- `ValidationPipe` rejeita payload inválido ou com campo fora do DTO.
- `ClassSerializerInterceptor` aplica as regras de serialização das entidades em toda resposta.

**Infraestrutura**
- Postgres via Docker Compose (healthcheck + volume nomeado).
- Configuração via `.env` (`.env.example` documenta as variáveis).

## Comandos úteis

```bash
npm run test          # testes unitários (vitest)
npm run test:e2e      # testes e2e
docker compose down   # derruba o Postgres (add -v para apagar os dados)
```
