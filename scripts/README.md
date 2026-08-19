# Scripts administrativos

## Resetar senha localmente

O arquivo `admin-reset-password.js` redefine a senha de um usuário armazenado no `localStorage`.

Como executar:

1. Abra o Arrow Counter no mesmo navegador e perfil onde o cadastro existe.
2. Abra as ferramentas de desenvolvedor (`F12` ou `Ctrl+Shift+I`).
3. Abra a aba **Console**.
4. Copie e cole o conteúdo de `scripts/admin-reset-password.js`.
5. Informe o e-mail cadastrado e a nova senha.
6. Faça login novamente.

O script mantém o perfil, o contador, as configurações e o hash do OBS; somente `passwordHash` e `salt` são substituídos.

> Importante: esse recurso existe apenas porque a versão atual usa `localStorage`. Não há autenticação administrativa real. Em uma versão com backend, o reset deve ser feito por uma rota administrativa protegida, com autorização, auditoria e confirmação de identidade.
