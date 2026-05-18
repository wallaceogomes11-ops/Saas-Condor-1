# 🚚 Canhoto de Entrega - PWA

Sistema de comprovante de entrega digital para motoristas. Permite registrar canhotos com foto, gerenciar notas fiscais e visualizar histórico de entregas.

![Preview](https://via.placeholder.com/430x800/1a6b2e/ffffff?text=Canhoto+de+Entrega)

## ✨ Funcionalidades

- **Login** com nome do motorista + persistência de sessão
- **Comprovante de entrega** com foto do canhoto
- **Select pesquisável** de notas fiscais
- **Câmera ou galeria** para captura da foto
- **Compressão automática** de imagens
- **Histórico** com busca e filtro por data
- **Gestão de notas fiscais** com status
- **Configurações** com limpeza de cache e logout
- **PWA instalável** no celular
- **Modo offline** com LocalStorage
- **Firebase opcional** para sync em nuvem

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Framework + Build |
| Tailwind CSS | Estilização |
| Framer Motion | Animações |
| React Router v6 | Roteamento |
| Firebase (opcional) | Backend em nuvem |
| LocalStorage | Cache offline |
| vite-plugin-pwa | PWA + Service Worker |
| browser-image-compression | Compressão de fotos |
| react-hot-toast | Notificações |
| date-fns | Formatação de datas |

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Rodando localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/canhoto-entrega.git
cd canhoto-entrega

# Instale as dependências
npm install

# Configure as variáveis de ambiente (opcional - para Firebase)
cp .env.example .env
# Edite .env com suas credenciais Firebase

# Rode o projeto
npm run dev
```

Acesse: `http://localhost:5173/canhoto-entrega/`

## 🔥 Configuração Firebase (Opcional)

O app funciona 100% offline sem Firebase. Para habilitar sincronização em nuvem:

### 1. Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Dê um nome (ex: `canhoto-entrega`)
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2. Adicionar app Web

1. No painel, clique em **"</ >"** (Web)
2. Nome do app: `canhoto-web`
3. ✅ Marque **"Firebase Hosting"** (opcional)
4. Copie o objeto `firebaseConfig`

### 3. Habilitar Firestore

1. No menu lateral: **Build > Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"**
4. Selecione a região mais próxima

### 4. Habilitar Storage

1. No menu lateral: **Build > Storage**
2. Clique em **"Começar"**
3. Aceite as regras padrão
4. Selecione a região

### 5. Configurar variáveis de ambiente

Edite o arquivo `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Regras de segurança (Firestore)

No console Firebase > Firestore > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entregas/{id} {
      allow read, write: if true; // Em produção, adicione autenticação
    }
  }
}
```

### 7. Regras de segurança (Storage)

No console Firebase > Storage > Regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /canhotos/{allPaths=**} {
      allow read, write: if true; // Em produção, adicione autenticação
    }
  }
}
```

## 📦 Deploy no GitHub Pages

### 1. Criar repositório

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/canhoto-entrega.git
git push -u origin main
```

### 2. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Configurar secrets no GitHub (para Firebase)

No seu repositório GitHub:
1. Acesse **Settings > Secrets and variables > Actions**
2. Clique em **"New repository secret"**
3. Adicione cada variável do `.env`

### 4. Criar workflow GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install
        run: npm install

      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 5. Ativar GitHub Pages

1. Vá em **Settings > Pages**
2. Source: **"Deploy from a branch"**
3. Branch: **gh-pages** / root
4. Salve

Ou use o script manual:

```bash
npm run deploy
```

Seu app estará em: `https://SEU_USUARIO.github.io/canhoto-entrega/`

## 📱 Instalação como PWA

### Android (Chrome)
1. Abra o app no Chrome
2. Toque nos **3 pontinhos** no canto superior
3. Selecione **"Adicionar à tela inicial"**
4. Confirme

### iPhone (Safari)
1. Abra o app no Safari
2. Toque no ícone de **compartilhar** (quadrado com seta)
3. Selecione **"Adicionar à Tela de Início"**
4. Confirme

## 📁 Estrutura do Projeto

```
canhoto-entrega/
├── public/
│   └── icons/          # Ícones PWA (192x192, 512x512)
├── src/
│   ├── components/
│   │   ├── layout/     # Header, BottomNav
│   │   └── ui/         # Splash, SelectNota, FotoUpload, SkeletonCard, EmptyState
│   ├── context/        # AuthContext
│   ├── hooks/          # useImageCapture, useEntregas
│   ├── pages/          # LoginPage, HomePage, EntregasPage, HistoricoPage, ConfigPage, ComprovanteDetail
│   ├── services/       # firebase.js, storageService.js
│   ├── utils/          # (extensível)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔧 Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run deploy   # Deploy para GitHub Pages
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT — fique à vontade para usar, modificar e distribuir.
