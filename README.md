# Wellington Veículos

Plataforma comercial para divulgação, venda e locação de veículos, com catálogo público, atendimento por WhatsApp, chat em tempo real e painel administrativo. O projeto usa Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase e Vercel.

Os preços, especificações, imagens e contatos incluídos no seed são demonstrativos. Confirme e substitua esses dados antes da publicação comercial.

## Recursos

- Home editorial responsiva com destaques, busca, lançamentos e chamadas para contato.
- Catálogo com filtros funcionais por finalidade, marca, modelo, ano, preço, quilometragem, combustível, câmbio, cor e categoria.
- Página de veículo com galeria, fullscreen, swipe, opcionais, SEO dinâmico e mensagem contextual de WhatsApp.
- Contato, sobre, lançamentos, sitemap, robots, 404 e estados de carregamento/erro.
- Chat de visitante sem cadastro visível, usando Auth anônimo, PostgreSQL e Supabase Realtime.
- Painel com dashboard, CRUD de veículos, upload/reordenação de imagens, leads, mensagens, banners, lançamentos, usuários, relatórios e configurações.
- Papéis `owner`, `admin`, `manager`, `sales` e `support`, com autorização no servidor e RLS no banco.
- Migrations, índices, triggers, Storage, seed e políticas de segurança versionados em `supabase/`.

## Requisitos

- Node.js 20.9 ou superior.
- npm 10 ou superior.
- Docker Desktop somente se for executar o Supabase local.
- Uma conta Supabase e uma conta Vercel para produção.

## Instalação

```bash
npm install
```

Crie o arquivo local de ambiente:

```powershell
Copy-Item .env.example .env.local
```

No macOS ou Linux:

```bash
cp .env.example .env.local
```

Sem variáveis Supabase, a aplicação inicia em modo demonstração, já preenchida. Nenhuma credencial fictícia é usada.

## Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`. O catálogo estará completo e `/admin` poderá ser percorrido em modo demonstração.

Verificações disponíveis:

```bash
npm run lint
npm run typecheck
npm run build
```

## Configurar o Supabase

1. Crie um projeto em `https://supabase.com/dashboard`.
2. Em **Authentication > Providers**, mantenha Email habilitado e habilite **Anonymous Sign-Ins** para o chat de visitantes.
3. Em **Project Settings > API**, copie a URL, a chave pública/anon e a `service_role` para `.env.local`.
4. Autentique e vincule o CLI:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
```

5. Confira as migrations antes de aplicar:

```bash
npx supabase db push --dry-run
```

6. Em um projeto novo de desenvolvimento, aplique migrations e dados demo:

```bash
npx supabase db push --include-seed
```

Em produção, use `npx supabase db push` sem `--include-seed` e cadastre conteúdo real pelo painel. Nunca use `db reset --linked` em produção, pois esse comando apaga dados.

A migration cria automaticamente:

- banco PostgreSQL, relacionamentos, constraints e índices;
- bucket público `vehicle-images`, limitado a 8 MB e a JPG/PNG/WebP;
- policies RLS para leitura pública, visitantes, equipe e administradores;
- publicação Realtime da tabela `messages`;
- trigger de perfil, timestamps, atividade e atualização de conversas.

## Criar o primeiro administrador

1. No Dashboard Supabase, abra **Authentication > Users > Add user**.
2. Crie o usuário com e-mail confirmado e senha forte.
3. Copie o UUID do usuário.
4. No SQL Editor, execute substituindo o UUID:

```sql
update public.profiles
set role = 'owner', full_name = 'Wellington', active = true
where id = 'UUID_DO_USUARIO';
```

O trigger da migration já cria o registro em `profiles`. Depois, entre em `/auth/login`. Convites seguintes podem ser enviados em `/admin/usuarios`; essa operação usa a chave `service_role` apenas no servidor.

## Variáveis de ambiente

| Variável | Exposição | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | navegador e servidor | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | navegador e servidor | acesso público protegido por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | somente servidor | convite administrativo; nunca expor no frontend |
| `NEXT_PUBLIC_SITE_URL` | navegador e servidor | canonical, Open Graph e sitemap |

O `.gitignore` bloqueia `.env.local` e os demais arquivos `.env`, exceto `.env.example`.

## Storage e imagens

O formulário de veículo envia arquivos autenticados para:

```text
vehicle-images/vehicles/{vehicle_id}/{uuid}.{ext}
```

As URLs ficam em `vehicle_images`. A imagem de capa é única por veículo e a ordem é persistida em `position`. Fotografias demonstrativas estão centralizadas em `src/lib/demo-data.ts`; o hero gerado está em `public/images/hero-velocity.png`.

## Deploy na Vercel

1. Envie o projeto ao repositório GitHub.
2. Na Vercel, selecione **Add New Project** e importe `Wellington-Veiculos`.
3. O framework Next.js será detectado automaticamente.
4. Cadastre as quatro variáveis de `.env.example` nos ambientes Production, Preview e Development conforme necessário.
5. Defina `NEXT_PUBLIC_SITE_URL` com o domínio final.
6. Faça o deploy e adicione o domínio de produção em **Supabase > Authentication > URL Configuration**.

O comando de build é `npm run build`; não há configuração especial de saída.

## Estrutura principal

```text
src/
├── app/
│   ├── (public)/          páginas comerciais
│   ├── admin/             painel administrativo
│   ├── api/               leads, chat, tracking e mutações admin
│   └── auth/              login administrativo
├── components/
│   ├── admin/
│   ├── chat/
│   ├── forms/
│   ├── home/
│   ├── layout/
│   ├── ui/
│   └── vehicles/
├── lib/
│   ├── supabase/          clientes browser, SSR e service role
│   ├── auth.ts            autorização de mutações
│   ├── data.ts            Supabase com fallback demo
│   └── demo-data.ts
└── types/

supabase/
├── migrations/
├── config.toml
└── seed.sql
```

## Segurança operacional

- RLS permanece habilitado em todas as tabelas públicas.
- Cada endpoint administrativo revalida sessão e função; esconder botões não é considerado autorização.
- Visitantes usam sessão anônima Supabase e só leem a própria conversa.
- Veículo vendido, alugado ou arquivado não é apagado automaticamente.
- Exclusões permanentes exigem papel elevado e confirmação na interface.
- A `SUPABASE_SERVICE_ROLE_KEY` é importada apenas por módulos de servidor.
