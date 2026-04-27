# 🏋️ FitCal — Personal Trainer Digital

**PWA de treino e dieta focado em calistenia, hipertrofia e redução de gordura corporal.**

> Funciona 100% offline • Sem backend • Zero dependências externas

---

## 📁 Estrutura do Projeto

```
fitcal-app/
├── index.html              # App principal (todas as telas)
├── manifest.json           # Configuração PWA
├── service-worker.js       # Cache offline
├── css/
│   └── style.css           # Design premium (tema escuro laranja)
├── js/
│   ├── storage.js          # Persistência (localStorage)
│   ├── workout.js          # Lógica de treinos e exercícios
│   ├── diet.js             # Cálculos nutricionais e dieta
│   └── app.js              # Aplicação principal e UI
└── assets/
    └── icons/
        ├── icon-192.png    # Ícone PWA 192x192
        └── icon-512.png    # Ícone PWA 512x512
```

---

## 🚀 Como Hospedar no GitHub Pages

### Passo 1 — Criar repositório no GitHub

1. Acesse **github.com** e faça login
2. Clique em **"New repository"** (botão verde)
3. Nomeie como `fitcal-app` (ou qualquer nome)
4. Marque como **Public**
5. Clique em **"Create repository"**

### Passo 2 — Fazer upload dos arquivos

**Opção A — Via interface web (mais fácil):**

1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos e pastas do projeto
3. Clique em **"Commit changes"**

**Opção B — Via Git (recomendado):**

```bash
# No terminal, dentro da pasta fitcal-app/
git init
git add .
git commit -m "🚀 FitCal v1.0 - Personal Trainer PWA"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/fitcal-app.git
git push -u origin main
```

### Passo 3 — Ativar GitHub Pages

1. No repositório, clique em **"Settings"** (aba superior)
2. No menu lateral, clique em **"Pages"**
3. Em **"Source"**, selecione:
   - Branch: `main`
   - Folder: `/ (root)`
4. Clique em **"Save"**
5. Aguarde 1-3 minutos

### Passo 4 — Acessar o App

Seu app estará disponível em:
```
https://SEU_USUARIO.github.io/fitcal-app/
```

---

## 📱 Como Instalar no Celular

### Android (Chrome):
1. Acesse a URL do app no Chrome
2. Toque no banner **"Adicionar à tela inicial"** OU
3. Menu ⋮ → **"Instalar aplicativo"** / **"Adicionar à tela inicial"**

### iOS (Safari):
1. Acesse a URL no Safari
2. Toque em **Compartilhar** (ícone de seta para cima)
3. Toque em **"Adicionar à Tela de Início"**
4. Toque em **"Adicionar"**

---

## 🔌 Como Testar Offline

### Método 1 — Chrome DevTools:
1. Abra o app no Chrome
2. F12 → Aba **"Application"**
3. Clique em **"Service Workers"**
4. Marque **"Offline"**
5. Recarregue a página — deve funcionar normalmente

### Método 2 — Modo avião:
1. Instale o app no celular
2. Ative o modo avião
3. Abra o app — funciona offline!

---

## ✨ Funcionalidades

### 👤 Perfil Inteligente
- Calcula IMC automaticamente
- Calcula TMB (Taxa Metabólica Basal) — Harris-Benedict
- Define meta calórica (superávit para massa, déficit para corte)
- Calcula proteína ideal (1.6 a 2.2g/kg)

### 🏋️ Treinos Automáticos
| Dia | Treino |
|-----|--------|
| Segunda | Peito + Tríceps |
| Terça | Costas + Bíceps |
| Quarta | Descanso |
| Quinta | Pernas |
| Sexta | Full Body |
| Sáb/Dom | Descanso |

### 💪 Exercícios com Progressão
Cada exercício tem 4 níveis de dificuldade:
- **Feedback "Fácil"** → sobe um nível automaticamente
- **Feedback "Difícil"** → desce um nível
- **Animações SVG** de cada movimento (boneco animado)

### 🥗 Dieta de Baixo Custo
Alimentos base: Ovo, Frango, Sardinha, Arroz, Feijão, Aveia, Macarrão
- 3 refeições com quantidades em gramas
- Calorias e macros detalhados
- Custo estimado por dia (~R$ 8-15)
- Tabela de substituições

### 🎮 Gamificação
- Sistema de XP (+50 por exercício concluído)
- Bônus de streak (×1.2 com 3 dias, ×1.5 com 7 dias)
- Níveis (a cada 500 XP)
- Conquistas desbloqueáveis

### 📊 Dashboard
- Gráfico de evolução de peso
- Histórico de treinos (últimos 90)
- Sequência de dias ativos
- Conquistas com progresso

### 🤖 Coach Digital
Respostas automáticas sobre:
- Proteína e macros
- Substituições alimentares
- Horários de refeição
- Suplementação
- Dor muscular
- Estratégias de corte/massa

---

## 🛠️ Tecnologias

- **HTML5** + **CSS3** + **Vanilla JavaScript** (ES6+)
- **PWA**: Service Worker + Web App Manifest
- **LocalStorage** para persistência de dados
- **SVG** para animações dos exercícios
- **Google Fonts**: Bebas Neue + Syne + DM Sans
- **Sem frameworks**, sem npm, sem build step

---

## 📦 Deploy em Outros Serviços

### Netlify (alternativa ao GitHub Pages):
1. Acesse **netlify.com**
2. Arraste a pasta `fitcal-app/` para a área de deploy
3. Pronto! URL gerada automaticamente

### Vercel:
```bash
npm i -g vercel
cd fitcal-app
vercel --prod
```

---

## 📄 Licença

MIT — Uso livre para projetos pessoais e educacionais.

---

*Feito com 🔥 para quem quer resultado sem academia e sem gastar muito.*
