# Company Profiler

Uma ferramenta de análise empresarial baseada em IA que gera automaticamente perfis abrangentes de empresas analisando conteúdo de websites. Construída com Next.js, TypeScript, e integração avançada de IA.

## ✨ Funcionalidades

### 🤖 Análise Alimentada por IA
- **Extração de Conteúdo de Website**: Automaticamente raspa e analisa websites de empresas
- **Detecção de Logo da Empresa**: Recupera e exibe logos de empresas
- **Geração de Linhas de Serviço**: Descrições de serviços geradas por IA baseadas na análise do website
- **Extração de Palavras-chave**: Identifica automaticamente palavras-chave Tier 1 e Tier 2
- **Mineração de Informações de Contato**: Extrai emails e detalhes de contato

### 🎨 UI/UX Moderna
- **Design Totalmente Responsivo**: Otimizado para mobile, tablet e desktop
- **Suporte a Tema Escuro/Claro**: Alternância de tema integrada
- **Gradientes Animados**: Belas animações de fundo
- **Interações Baseadas em Modal**: Fluxos de trabalho suaves em modal
- **Estados de Carregamento**: Indicadores de progresso envolventes

### 📊 Gerenciamento de Perfil
- **Edição Interativa**: Edite todos os campos do perfil inline
- **Exportação JSON**: Exporte perfis em formato JSON
- **Atualizações em Tempo Real**: Visualização ao vivo das mudanças
- **Validação de Dados**: Validação de formulário integrada

### 🔧 Funcionalidades Técnicas
- **TypeScript**: Segurança de tipos completa em toda a aplicação
- **Tailwind CSS + DaisyUI**: Framework de estilização moderno
- **Hooks Customizados**: Hooks React reutilizáveis para gerenciamento de dados
- **Arquitetura de Serviços**: Camada de serviço modular
- **Tratamento de Erros**: Gerenciamento abrangente de erros
- **Turbopack**: Bundler de desenvolvimento ultra-rápido

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone [repository-url]
   cd mccarren-challenge
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra seu navegador**
   Navegue para [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── agent/                 # Lógica do agente IA
│   │   ├── handlers/          # Manipuladores de resposta
│   │   ├── prompts/           # Prompts do sistema
│   │   ├── services/          # Serviços de lógica de negócio
│   │   ├── tools/             # Ferramentas e utilitários de IA
│   │   ├── types/             # Definições TypeScript
│   │   └── utils/             # Utilitários do agente
│   ├── api/                   # Rotas da API
│   │   ├── agent/             # Endpoint principal do agente
│   │   │   └── service-lines/ # Geração de linhas de serviço
│   │   └── logo/              # Endpoint de recuperação de logo
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes de UI
│   │   └── [modals/pages]     # Componentes de funcionalidade
│   ├── contexts/              # Contextos React
│   ├── hooks/                 # Hooks React customizados
│   ├── profile/               # Página de perfil
│   └── utils/                 # Funções utilitárias
```

## 🛠 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento com Turbopack
- `npm run build` - Constrói para produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run test:ut` - Executa testes unitários com Vitest (modo verbose)

## 🎯 Como Funciona

### 1. **Análise de Website**
   - Usuário insere URL do website da empresa
   - Agente IA analisa o conteúdo do website
   - Extrai informações da empresa, serviços e contatos

### 2. **Geração de Perfil**
   - Cria perfil estruturado da empresa
   - Gera linhas de serviço usando IA
   - Identifica palavras-chave relevantes
   - Recupera logo da empresa

### 3. **Edição Interativa**
   - Usuários podem editar qualquer campo no perfil
   - Adicionar linhas de serviço customizadas manualmente ou via IA
   - Exportar perfil final como JSON

## 🧪 Testes

Execute testes unitários:
```bash
npm run test:ut
```

Execute arquivo de teste específico:
```bash
npm run test:ut "filename"
```

*Nota: Sempre execute os testes na raiz do projeto*

## 🎨 Estilização

O projeto usa:
- **Tailwind CSS v4** para estilização utility-first
- **DaisyUI** para biblioteca de componentes
- **Ant Design** para componentes complementares
- **Framer Motion** para animações
- **Lucide React** para ícones
- **Variáveis CSS Customizadas** para temas
- **Design Responsivo** com abordagem mobile-first

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
# Adicione suas variáveis de ambiente aqui
OPENAI_API_KEY=sua_chave_api_openai
NEXT_PUBLIC_API_URL=sua_url_api
```

### Configuração do Tailwind
A estilização é configurada em:
- `tailwind.config.js`
- `src/app/globals.css`

## 🏗 Principais Dependências

### Produção
- **Next.js 15.4.1** - Framework React
- **React 19.1.0** - Biblioteca UI
- **TypeScript 5** - Segurança de tipos
- **@ai-sdk/openai 1.3.23** - Integração com OpenAI
- **@ai-sdk/react 1.2.12** - Hooks React para IA
- **ai 4.3.19** - SDK de IA
- **Zod 3.25.76** - Validação de esquemas
- **Cheerio 1.1.0** - Parsing de HTML
- **Framer Motion 12.23.6** - Animações

### Desenvolvimento
- **Vitest 3.2.4** - Framework de testes
- **ESLint 9** - Linting
- **DaisyUI 5.0.46** - Componentes UI
- **Tailwind CSS 4** - Framework CSS

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Deploy automático a cada push para main

### Deploy Manual
```bash
npm run build
npm start
```

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch de feature
3. Faça suas mudanças
4. Execute testes e linting
5. Submeta um pull request

## 📝 Endpoints da API

- `POST /api/agent` - Análise principal do agente IA
- `POST /api/agent/service-lines` - Gerar linhas de serviço
- `GET /api/logo` - Recuperar logo da empresa

## 🔍 Funcionalidades em Detalhe

### Ferramentas do Agente IA
- `getWebsiteContent` - Raspa conteúdo do website
- `getCompanyLogo` - Recupera logos de empresas
- `redirectToProfile` - Manipulação de navegação
- `returnToHomeWithError` - Tratamento de erros

### Hooks Customizados
- `useAgentChat` - Gerenciamento de conversação IA
- `useAsyncLogo` - Carregamento de logo
- `useProfileData` - Gerenciamento de estado do perfil
- `useServiceLineGeneration` - Geração de serviços via IA

### Serviços
- `LogoService` - Gerenciamento e cache de logos
- `ServiceLineGenerator` - Geração de serviços baseada em IA
- `UserCacheService` - Cache de dados do usuário

### Estruturas de Dados Principais

```typescript
interface CompanyProfile {
    companyName: string;
    description: string;
    serviceLines: string[];
    tier1Keywords: string[];
    tier2Keywords: string[];
    emails: string[];
    pointOfContact: string;
    logoBase64?: string;
}

interface AnalysisData {
    url: string;
    email: string;
    poc: string;
}
```

## 📱 Breakpoints Responsivos

- **Mobile**: `< 640px`
- **Tablet**: `sm: ≥ 640px`
- **Desktop Small**: `md: ≥ 768px`
- **Desktop Medium**: `lg: ≥ 1024px`
- **Desktop Large**: `xl: ≥ 1280px`

## 🚀 Performance

- **Turbopack**: Bundler de desenvolvimento ultra-rápido
- **React 19**: Versão mais recente com melhorias de performance
- **Next.js 15**: Otimizações de build e runtime
- **Lazy Loading**: Carregamento otimizado de componentes

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

Construído com ❤️ pela equipe de desenvolvimento
