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

## Estrutura

```
src/
├── auth/          # login, JWT strategy, guards (JwtAuthGuard, RolesGuard), decorator @Roles
├── user/          # cadastro de ADMIN/FUNCIONARIO
├── animal/        # cadastro de animais disponíveis pra adoção
├── interesse/     # manifestações de interesse de visitantes num animal
└── common/        # BaseEntity (id uuid, createdAt, updatedAt) compartilhada pelas entities
```

Cada módulo segue o padrão NestJS: `entity` (TypeORM) → `dto` (validação com `class-validator`) → `service` (regra de negócio + repositório) → `controller` (rotas HTTP).

## Rotas

| Método | Rota                    | Acesso              | O que faz                                              |
| ------ | ----------------------- | ------------------- | ------------------------------------------------------- |
| POST   | `/users`                | ADMIN                | Cria usuário (hash da senha, e-mail único)              |
| POST   | `/auth/login`           | Público              | Autentica por e-mail + senha, retorna `access_token`    |
| POST   | `/animal`                | ADMIN, FUNCIONARIO   | Cadastra animal                                          |
| POST   | `/interesse`             | Público              | Visitante registra interesse em um animal                |
| GET    | `/interesse`             | ADMIN, FUNCIONARIO   | Lista manifestações de interesse                          |
| PATCH  | `/interesse/:id/status`  | ADMIN, FUNCIONARIO   | Atualiza a situação de uma manifestação                   |

Rotas protegidas exigem header `Authorization: Bearer <access_token>` (obtido no login).

## Features

**Usuário**
- Entidade `User` com `nome`, `email`, `senha`, `role` (`ADMIN`/`FUNCIONARIO`, default `FUNCIONARIO`).
- E-mail único, senha com hash bcrypt (salt rounds 10), nunca retornada nas respostas.
- Cadastro restrito a ADMIN autenticado.

**Autenticação e autorização**
- Login por e-mail + senha, retorna JWT (`access_token`) com `sub`, `email` e `role`.
- `JwtAuthGuard` (passport-jwt) exige token válido; `RolesGuard` + `@Roles(...)` restringe por `role`.

**Animal**
- Entidade `Animal`: `nome`, `especie`, `raca` (opcional), `idade`, `sexoAnimal`, `porte`, `descricao`/`fotoUrl`/`observacao` (opcionais), `status` (`DISPONIVEL`/`EM_PROCESSO`/`ADOTADO`, default `DISPONIVEL`).

**Interesse**
- Entidade `Interesse`: vinculada a um `Animal` (`animal_id`), dados do interessado (`nomeInteressado`, `email`, `telefone`, `mensagem` opcional), `status` (`PENDENTE`/`EM_ANALISE`/`APROVADO`/`REJEITADO`, default `PENDENTE`).
- Ao atualizar o status, `analisadoPor` é preenchido automaticamente com o usuário autenticado que fez a alteração.

**Global**
- `ValidationPipe` rejeita payload inválido ou com campo fora do DTO.
- `ClassSerializerInterceptor` aplica as regras de serialização das entidades em toda resposta.

**Infraestrutura**
- Postgres via Docker Compose (healthcheck + volume nomeado).
- Configuração via `.env` (`.env.example` documenta as variáveis) — gere um `JWT_SECRET` forte e aleatório, nunca use o placeholder em produção.
- `synchronize: true` está ativo (só para desenvolvimento) — o schema é sincronizado automaticamente a partir das entities.

## Comandos úteis

```bash
npm run test          # testes unitários (vitest)
npm run test:e2e      # testes e2e
docker compose down   # derruba o Postgres (add -v para apagar os dados)
```
