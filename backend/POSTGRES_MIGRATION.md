# Migrando o projeto para PostgreSQL

Esta nota descreve os passos para preparar e executar a migração do banco SQLite atual para PostgreSQL.

1. Iniciar o Postgres via Docker Compose

```bash
# Na raiz do repositório
docker-compose -f docker-compose.postgres.yml up -d
```

2. Ajustar variáveis de ambiente

Defina `DATABASE_URL` para apontar ao serviço Postgres (exemplo):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs2_fortune
```

3. Gerar novo schema e migração (a partir de `backend/prisma/schema.postgres.prisma`)

Copie `backend/prisma/schema.postgres.prisma` para `backend/prisma/schema.prisma` ou rode o comando com a flag `--schema`:

```bash
# Exemplo usando schema postgresql direto
cd backend
npx prisma migrate dev --name init --schema=prisma/schema.postgres.prisma
npx prisma generate --schema=prisma/schema.postgres.prisma
```

4. Atualizar `.env` do backend com `DATABASE_URL` e ajustar `schema.prisma` caso queira manter apenas um arquivo.

5. (Opcional) Exportar/importar dados do SQLite para Postgres — dependendo do volume de dados. Para dados pequenos, você pode escrever um script Node que lê do SQLite e insere no Postgres.

6. Testar a aplicação apontando para o Postgres e rodando `npm start` no backend.

Observações:
- `schema.postgres.prisma` já define `itemsSent`/`itemsReceived` como `Json` para aproveitar o tipo nativo do Postgres.
- Mantenha backups do arquivo `dev.db` caso precise recuperar dados.

Se quiser, eu posso executar esses passos aqui (levantar o Docker Compose, ajustar .env e rodar `prisma migrate dev`), mas preciso que você confirme e que o Docker esteja disponível no seu ambiente local.

7. Migrar dados do SQLite para Postgres (script opcional)

O repositório inclui um script de migração que copia dados do `dev.db` (SQLite) para o Postgres e converte os campos `itemsSent/itemsReceived` em JSONB.

Como usar (após o Postgres estar rodando e a migração aplicada):

```bash
cd backend
npm install sqlite3 pg
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs2_fortune
node scripts/migrate-sqlite-to-postgres.js
```

Revise o script `backend/scripts/migrate-sqlite-to-postgres.js` antes de executar; é um utilitário básico e pode necessitar de ajustes para cenários específicos.

8. Verificar integridade (comparar contagens SQLite x Postgres)

Após rodar o script de importação, você pode comparar rapidamente contagens com o utilitário incluído:

```bash
cd backend
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs2_fortune
node scripts/compare-db-counts.js
```

O script listará tabelas com contagens iguais (OK) e diferenças (MISMATCH), mostrando até 10 IDs presentes no SQLite mas ausentes no Postgres para investigação.
