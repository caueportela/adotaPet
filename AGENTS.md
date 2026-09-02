# adotaPet — regras de negócio

## Usuário
- Campos: `nome`, `email` (único), `senha`, `role`.
- `role`: `ADMIN` ou `FUNCIONARIO`, default `FUNCIONARIO`.
- Senha: hash com bcrypt, salt rounds 10. Nunca é retornada nas respostas (`@Exclude()` na entidade).
- Cadastro (`POST /users`) rejeita e-mail já existente (`409`).

## Autenticação
- `POST /auth/login` valida e-mail + senha e retorna `{ access_token, user }`.
- Credencial inválida → `401`, sem detalhar se o erro foi e-mail ou senha.
- JWT carrega `sub` (id), `email` e `role`. Expiração via `JWT_EXPIRES_IN` (`.env`).

## Validação
- Todo payload passa por `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) — campo fora do DTO é rejeitado.
