# Arrow Counter

> Contador automático de disparos de arco e flecha para navegador, celular, smartwatch/Wear OS e OBS Studio.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-f59e0b)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)
![Backend](https://img.shields.io/badge/backend-Express%20%2B%20WebSocket-111827)
![Protocolo](https://img.shields.io/badge/acesso-HTTPS-16a34a)

O Arrow Counter mantém uma única sessão compartilhada. O contador, a meta da sessão e as configurações ficam disponíveis em tempo real no computador, celular, smartwatch e overlay do OBS.

---

## 1. Pré-requisitos

Esta seção é destinada principalmente a quem vai instalar e operar o sistema sem experiência em programação.

### 1.1 Computador servidor

É necessário um computador na mesma rede Wi-Fi dos dispositivos que usarão o contador.

- Windows 10/11, macOS ou Linux.
- Pelo menos 2 GB de RAM livres.
- Conexão à rede local.
- Permissão para executar um programa na porta `5173`.
- Navegador moderno: Chrome, Edge, Firefox ou Safari.
- Node.js versão 20 ou superior.
- npm, instalado junto com o Node.js.

O computador servidor precisa permanecer ligado enquanto o contador estiver sendo usado. Ele pode ser o computador que também executa o OBS.

### 1.2 Dispositivo com acelerômetro

Para a detecção automática, use um celular ou smartwatch com sensor de movimento:

- Android com Chrome ou navegador compatível.
- iPhone/iPad com Safari ou navegador compatível.
- Wear OS com navegador que entregue eventos de movimento.

O acesso deve ser feito por HTTPS. O projeto inclui um certificado local de desenvolvimento. Como ele não é emitido por uma autoridade certificadora pública, o navegador exibirá um aviso na primeira abertura.

### 1.3 OBS Studio

Para exibir o contador em uma transmissão, instale o [OBS Studio](https://obsproject.com/). A fonte usada será uma **Fonte de navegador** apontando para o endereço gerado pelo aplicativo.

---

## 2. Como iniciar o serviço e utilizar o app

Siga exatamente esta sequência na primeira utilização.

### 2.1 Instalar o Node.js

1. Abra [nodejs.org](https://nodejs.org/).
2. Baixe a versão **LTS**.
3. Execute o instalador.
4. Aceite as opções padrão.
5. Feche e abra novamente o terminal após a instalação.
6. Confirme que a instalação terminou executando `node --version` e `npm --version`.

### 2.2 Abrir a pasta do projeto

No terminal, entre na pasta do projeto:

```bash
cd /home/rafaell/flecha
```

No Windows, use o caminho real da pasta, por exemplo:

```powershell
cd C:\Users\SEU_USUARIO\flecha
```

### 2.3 Instalar as dependências

Execute uma vez:

```bash
npm install
```

Esse comando instala React, Vite, Express, WebSocket e os demais componentes necessários.

### 2.4 Compilar o aplicativo

Antes de iniciar o serviço, gere a versão que será entregue pelo servidor:

```bash
npm run build
```

A pasta `dist/` será criada ou atualizada.

### 2.5 Iniciar o serviço

Execute:

```bash
npm run dev
```

Apesar do nome `dev`, este é o comando principal deste projeto: ele mantém o frontend compilado atualizado e inicia o servidor HTTPS.

Quando aparecer uma mensagem semelhante a esta, o serviço está ativo:

```text
Arrow Counter disponível em https://localhost:5173 e https://192.168.1.6:5173
```

Não feche esse terminal durante o uso.

> Se aparecer `EADDRINUSE`, a porta `5173` já está ocupada. Feche outra execução do Arrow Counter ou encerre o processo que está usando essa porta.

### 2.6 Abrir no computador

No navegador do computador servidor, abra:

- `https://localhost:5173`

Na primeira abertura, confirme o aviso de certificado local. O texto exato varia entre os navegadores; normalmente é necessário selecionar **Avançado** e depois **Continuar**.

### 2.7 Abrir no celular ou smartwatch

1. Descubra o endereço IP do computador servidor na rede local.
2. No exemplo deste projeto, o endereço é `192.168.1.6`.
3. Conecte o celular ou relógio à mesma rede Wi-Fi.
4. Abra no navegador:

```text
https://192.168.1.6:5173
```

5. Aceite o certificado local na primeira visita.
6. Toque em **Iniciar detecção**.
7. Se o navegador solicitar permissão de movimento, escolha **Permitir**.
8. Prenda o dispositivo de forma firme e faça testes controlados.

Todos os dispositivos conectados ao mesmo endereço visualizam a mesma sessão.

### 2.8 Encerrar o serviço

No terminal onde o serviço está rodando, pressione `Ctrl+C`.

O estado é salvo em `data/shared-session.json`, portanto o contador e as configurações permanecem disponíveis na próxima execução.

---

## 3. Primeiro uso recomendado

1. Abra o aplicativo no computador.
2. Acesse **Configurações**.
3. Defina a meta em **Disparos pretendidos**.
4. Escolha se o overlay deve mostrar a meta.
5. Configure a sensibilidade começando em `50`.
6. Configure o intervalo mínimo entre disparos, começando em `1,0 s`.
7. Salve as configurações.
8. Abra o app no celular ou relógio.
9. Inicie a detecção e faça alguns disparos de teste.
10. Se movimentos leves forem contados, aumente o valor da sensibilidade. Valores maiores tornam o sensor menos sensível.
11. Se um disparo não for detectado, reduza a sensibilidade ou diminua o intervalo mínimo.

A tela mostra o movimento medido e o limiar atual enquanto a detecção está ativa. Use essa informação para ajustar o comportamento sem depender de tentativa e erro.

---

## 4. Configuração do overlay no OBS

1. Abra **Configurações** no Arrow Counter.
2. Configure a aparência do contador.
3. Copie o endereço exibido na seção **Conexão com OBS**.
4. Abra o OBS Studio.
5. Na cena desejada, clique em `+` na área **Fontes**.
6. Selecione **Navegador**.
7. Dê um nome, como `Arrow Counter`.
8. Cole o endereço copiado no campo **URL**.
9. Defina largura e altura adequadas à transmissão.
10. Confirme em **OK**.

O overlay é atualizado automaticamente quando o contador muda. Não é necessário recarregar a fonte do OBS.

### Formatos do contador

Com a meta ativada:

```text
12/30
```

Com a meta desativada:

```text
12
```

A opção **Mostrar identificação junto ao número** controla o texto `Disparos` acima do número.

> Recomendação: mantenha o endereço do overlay gerado pelo próprio aplicativo. Ele inclui as configurações visuais e o identificador da sessão.

---

## 5. Arquitetura da aplicação

O projeto é dividido em três partes principais:

```text
Dispositivo / OBS
        │ HTTPS + WebSocket
        ▼
Servidor Express (server.js)
        │
        ▼
data/shared-session.json
```

### 5.1 Frontend

O frontend é uma aplicação React compilada pelo Vite. Ele apresenta as telas, captura o acelerômetro, envia alterações e recebe atualizações em tempo real.

### 5.2 Backend

`server.js` cria um servidor HTTPS com Express e conecta um servidor WebSocket na mesma porta. Ele:

- Entrega os arquivos da pasta `dist/`.
- Expõe a sessão atual pela API.
- Recebe alterações de configuração.
- Incrementa o contador de forma atômica.
- Persiste os dados no arquivo JSON.
- Transmite mudanças para todos os dispositivos conectados.

### 5.3 Sessão compartilhada

Existe uma única sessão padrão. Não há login, cadastro ou separação por usuário.

O estado contém, entre outros dados:

- `count`: número atual de disparos.
- `obsHash`: identificador do overlay.
- `settings.sensitivity`: sensibilidade do acelerômetro.
- `settings.cooldown`: intervalo mínimo entre detecções.
- `settings.targetCount`: meta pretendida.
- `settings.showTarget`: exibição ou ocultação da meta.
- Cores, fonte e tamanho do overlay.

---

## 6. Principais arquivos

| Arquivo | Responsabilidade |
|---|---|
| `server.js` | Servidor HTTPS, API, WebSocket e persistência da sessão. |
| `package.json` | Dependências e comandos npm. |
| `package-lock.json` | Versões exatas instaladas pelo npm. |
| `vite.config.js` | Configuração de build e portas do Vite. |
| `index.html` | Documento HTML inicial do frontend. |
| `data/shared-session.json` | Estado persistente da sessão única. |
| `certs/dev-key.pem` | Chave privada do certificado local; nunca publique. |
| `certs/dev-cert.pem` | Certificado HTTPS local; não é um certificado público. |
| `src/main.jsx` | Inicialização do React e registro dos providers. |
| `src/App.jsx` | Rotas principais da aplicação. |
| `src/index.css` | Estilos, responsividade e regras para relógios. |
| `src/context/SessionContext.jsx` | Estado compartilhado, API e WebSocket. |
| `src/pages/Home.jsx` | Contador, botões e detecção por acelerômetro. |
| `src/pages/Settings.jsx` | Configurações de detecção e overlay. |
| `src/pages/Obs.jsx` | Página visual carregada pelo OBS. |
| `src/hooks/useDeviceProfile.js` | Identificação de celular, tablet, desktop e Wear OS. |
| `dist/` | Arquivos compilados servidos pelo backend. |

---

## 7. API e sincronização

### `GET /api/session`

Retorna o estado atual da sessão.

### `PUT /api/session`

Atualiza configurações ou valores gerais da sessão. O corpo é JSON. Exemplo:

```json
{
  "settings": {
    "targetCount": 30,
    "showTarget": true
  }
}
```

### `POST /api/session/increment`

Incrementa o contador no servidor. Essa operação é usada pelo acelerômetro e evita perda de disparos quando mais de um dispositivo detecta um evento ao mesmo tempo.

### WebSocket `/ws`

Ao conectar, o cliente recebe o estado atual. Sempre que a sessão muda, o servidor transmite uma mensagem do tipo `state` para todos os clientes.

Essa arquitetura permite que o celular conte, o computador acompanhe e o OBS exiba o mesmo valor sem atualização manual.

---

## 8. Sensibilidade e detecção

A aplicação escuta o evento `devicemotion` do navegador.

Quando disponível, utiliza `event.acceleration`. Caso contrário, utiliza `event.accelerationIncludingGravity` e estabelece uma referência inicial para reduzir o efeito da gravidade.

O valor de sensibilidade representa o quanto o movimento precisa ser forte para ultrapassar o limiar:

- Valor menor: mais sensível, detecta movimentos mais fracos.
- Valor maior: menos sensível, exige movimento mais forte.

O intervalo mínimo evita que um único disparo seja contado várias vezes.

### Recomendações práticas

- Fixe bem o celular ou relógio.
- Evite deixar o dispositivo solto no pulso se isso gerar ruído.
- Faça testes com o mesmo movimento utilizado durante a sessão real.
- Aumente a sensibilidade para ignorar movimentos da mão.
- Aumente o intervalo mínimo se houver contagens duplicadas.
- Diminua a sensibilidade se disparos reais não forem reconhecidos.

> O sensor e o navegador variam muito entre aparelhos. A configuração ideal deve ser calibrada no dispositivo que realmente será usado.

---

## 9. HTTPS, certificado e rede local

O servidor usa um certificado local armazenado em `certs/`. Esses arquivos permitem que o navegador considere a página segura para uso do acelerômetro, mas não são apropriados para produção pública.

### Se o certificado for perdido

Gere novos arquivos no Linux/macOS com OpenSSL:

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 825 \
  -keyout certs/dev-key.pem \
  -out certs/dev-cert.pem \
  -subj "/CN=SEU_IP_LOCAL" \
  -addext "subjectAltName=IP:SEU_IP_LOCAL,DNS:localhost,IP:127.0.0.1"
chmod 600 certs/dev-key.pem
```

Substitua `SEU_IP_LOCAL` pelo IP do computador servidor e reinicie o serviço.

### Problemas de acesso

- Confirme que os dispositivos estão na mesma rede.
- Confirme o IP do computador servidor.
- Confirme que a porta `5173` está liberada no firewall.
- Use `https://`, não `http://`.
- Aceite o certificado em cada dispositivo.
- Evite redes Wi-Fi convidadas que bloqueiam comunicação entre aparelhos.

---

## 10. Manutenção para administradores

### Atualizar dependências

Antes de atualizar, faça uma cópia de `data/shared-session.json` e dos certificados. Depois execute:

```bash
npm install
npm run build
```

Teste o aplicativo antes de utilizar em uma sessão real.

### Fazer backup da sessão

Copie o arquivo:

```text
data/shared-session.json
```

Esse arquivo contém o contador e as configurações compartilhadas.

### Restaurar uma sessão

1. Pare o serviço com `Ctrl+C`.
2. Substitua `data/shared-session.json` pelo backup.
3. Inicie novamente com `npm run dev`.

### Alterar a porta

A porta padrão é `5173`. Para iniciar em outra porta no Linux/macOS:

```bash
PORT=8443 npm run dev
```

No Windows PowerShell:

```powershell
$env:PORT=8443; npm run dev
```

O certificado deve conter o nome/IP utilizado e o endereço precisa ser atualizado nos dispositivos.

---

## 11. Solução de problemas

### O acelerômetro não recebe movimentos

- Confirme que o endereço começa com `https://`.
- Aceite o certificado local.
- Toque em **Iniciar detecção** para liberar a permissão.
- Verifique se o navegador permite sensores de movimento.
- Teste no celular, não apenas no computador.
- Confirme que o dispositivo realmente possui acelerômetro.
- Verifique se o status informa `Nenhum movimento recebido`.

### O contador não sincroniza

- Confirme que o serviço está rodando.
- Verifique se todos usam o mesmo endereço.
- Confirme o indicador **Sessão sincronizada**.
- Atualize a página após aceitar o certificado.
- Verifique se o firewall não bloqueia a porta.

### O OBS não atualiza

- Abra o endereço do overlay no navegador normal.
- Confirme que a URL foi copiada inteira.
- Verifique se o OBS possui acesso à rede local.
- Reabra as propriedades da fonte de navegador.
- Não utilize `localhost` no OBS se o OBS estiver em outro computador.

### O serviço não inicia

- Execute `npm install`.
- Execute `npm run build`.
- Verifique se os arquivos em `certs/` existem.
- Verifique se a porta `5173` está livre.
- Leia a mensagem exibida no terminal.

---

## 12. Segurança e recomendações

- Não publique `certs/dev-key.pem` no GitHub.
- Não exponha este servidor diretamente à internet sem autenticação e certificado público.
- Use uma rede Wi-Fi privada e confiável.
- Faça backup de `data/shared-session.json` antes de alterações.
- Mantenha o Node.js e as dependências atualizados.
- Use HTTPS mesmo em rede local para que sensores e permissões funcionem.
- Para uso público, considere um domínio, certificado Let's Encrypt, autenticação e banco de dados.

Este projeto foi desenhado para uso local, treinamento e operação de uma sessão única. Ele não implementa controle de acesso nem múltiplas sessões independentes.

---

## 13. Comandos rápidos

```bash
# Entrar no projeto
cd /home/rafaell/flecha

# Instalar dependências
npm install

# Compilar
npm run build

# Iniciar o serviço HTTPS
npm run dev
```

Acesse `https://localhost:5173` no computador ou `https://IP_DO_SERVIDOR:5173` nos demais dispositivos.

---

## Licença

A licença deve ser definida pelo proprietário do repositório antes da publicação. Para um projeto pessoal no GitHub, recomenda-se escolher uma licença conhecida, como MIT, caso você queira permitir reutilização e modificações.
