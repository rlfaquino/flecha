/*
 * Reset administrativo de senha para a versão local do Arrow Counter.
 *
 * Como usar:
 * 1. Abra o app no mesmo navegador/perfil onde o usuário está cadastrado.
 * 2. Abra DevTools > Console.
 * 3. Cole este arquivo inteiro e pressione Enter.
 * 4. Informe o e-mail e a nova senha quando solicitado.
 *
 * Este script altera apenas a chave localStorage `arrow-counter-users`.
 * Não use em produção: a aplicação local não possui autenticação administrativa.
 */
(async () => {
  const email = prompt('E-mail do usuário:')?.trim().toLowerCase();
  const password = prompt('Nova senha (mínimo de 8 caracteres):');
  if (!email || !password) throw new Error('E-mail e senha são obrigatórios.');
  if (password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('E-mail inválido.');

  const users = JSON.parse(localStorage.getItem('arrow-counter-users') || '{}');
  const user = users[email];
  if (!user) throw new Error(`Usuário não encontrado: ${email}`);

  const encode = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  );

  users[email] = {
    ...user,
    passwordHash: encode(bits),
    salt: encode(salt),
  };
  localStorage.setItem('arrow-counter-users', JSON.stringify(users));
  localStorage.removeItem('arrow-counter-auth');
  console.info(`Senha redefinida com sucesso para ${email}.`);
})();
