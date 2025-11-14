# Bambin

Application de partage multimédia et d'informations entre crèches et parents (galerie photo, journal d'activité, gestion utilisateurs).

Ce README explique comment installer et lancer le projet en local (mode développeur), gérer la base de données et lancer les tests.

## Contenu rapide

- Backend (API serverless) : dossier `api/` (utilisé avec `vercel dev`).
- Base de données : Postgres (fournie via `docker-compose.yml`).
- Frontend : app Vue 3 + Vite (scripts définis dans `package.json` à la racine).

## Prérequis

- Git
- Node.js (recommandé : Node 22 pour compatibilité avec `@tsconfig/node22`; Node >=18 devrait généralement fonctionner)
- npm (fourni avec Node) ou yarn
- Docker et Docker Compose (ou Docker Desktop)
- Optionnel : `vercel` CLI (utilisé par le script `start`, sinon `npx vercel dev` fonctionne)

## Cloner le dépôt

```bash
git clone https://github.com/felikarina/bambin.git
cd bambin
```

## Installer les dépendances

Installez les dépendances à la racine du repo :

```bash
npm install
```

## Configuration des variables d'environnement

L'application attend une variable `DATABASE_URL` (utilisée par Drizzle / postgres). Exemple pour la configuration Docker fournie :

- Docker Compose (par défaut) crée une base Postgres exposée sur le port `<DB_PORT>` avec :
  - utilisateur : `DB_USER` (ex: `postgres`)
  - mot de passe : `DB_PASS` (ex: `strong-password`)
  - base : `DB_NAME` (ex: `DB_DEV`)

Exemple de valeur `DATABASE_URL` (Bash / WSL / Git Bash) :

```bash
export DATABASE_URL="postgres://DB_USER:DB_PASS@localhost:DB_PORT/DB_NAME"
```

PowerShell (Windows) :

```powershell
$env:DATABASE_URL = 'postgres://DB_USER:DB_PASS@localhost:DB_PORT/DB_NAME'
```

Pour les tests (Docker de test dans `docker-compose.test.yml`) l'URL exemple est :

```bash
export DATABASE_URL_TEST="postgres://TEST_DB_USER:TEST_DB_PASS@localhost:TEST_DB_PORT/TEST_DB_NAME"
```

Adaptez les valeurs si vous exécutez Postgres manuellement ou remote. Remplacez les placeholders par vos valeurs réelles en local ou dans CI.

## Lancer le projet en local (mode complet)

Le script `start` dans `package.json` effectue deux choses :

1. `docker-compose up -d` pour démarrer la base PostgreSQL et Adminer
2. `vercel dev` pour lancer les fonctions API (dossier `api/`) et servir l'application

Pour lancer (mode recommandé pour développement full-stack) :

```bash
npm run start
```

Remarques :

- Si vous n'avez pas globalement `vercel` : `npx vercel dev` fonctionnera aussi.
- `start.ts` s'occupe d'arrêter les containers Docker quand vous terminez (SIGINT/SIGTERM).

### Alternatives

- Lancer uniquement la base de données puis lancer VerceL manuellement :

```bash
docker-compose up -d
export DATABASE_URL="postgres://DB_USER:DB_PASS@localhost:DB_PORT/DB_NAME"
npx vercel dev --listen 3000
```

- Lancer uniquement le frontend (Vite) :

```bash
npm run dev
```

Cette commande démarre le serveur Vite (port par défaut 5173). Si vous voulez travailler uniquement sur l'UI sans les APIs locales, c'est utile.

## Bases de données / Migrations (Drizzle)

Les scripts utiles sont dans `package.json` :

- `npm run db:generate` — génère les fichiers de migration/DDL
- `npm run db:migrate` — exécute les migrations
- `npm run db:push` — pousse le schéma (drizzle-kit push)
- `npm run db:studio` — lance Drizzle Studio (si configuré)

Exemple :

```bash
export DATABASE_URL="postgres://DB_USER:DB_PASS@localhost:DB_PORT/DB_NAME"
npm run db:migrate
```

Si vous êtes en train de développer des changements de schéma, générez la migration, revoyez-la puis appliquez-la.

## Tests

Les scripts de test disponibles :

- `npm run test:unit` — tests unitaires (Vitest)
- `npm run test:e2e` — tests E2E (Playwright)
- `npm run test:db` — tests liés à la base (Vitest ciblant `backend/db/__tests__`)
- `npm run test:api` — lance `vercel dev` puis exécute `npm run test:db` via `start-server-and-test`

Exemples :

```bash
npm run test:unit
npm run test:e2e
```

Pour les tests qui nécessitent la DB, assurez-vous que le service Postgres de `docker-compose.test.yml` tourne ou que `DATABASE_URL` pointe sur une base de test compatible.

## Scripts utiles (récapitulatif)

- `npm run dev` — démarre Vite (frontend)

- `npm run start` — démarre Docker + `vercel dev` (stack complète)

## Dépannage rapide

- Docker ne démarre pas : vérifiez que Docker Desktop est installé et démarré.
- `vercel` non trouvé : installez-le globalement `npm i -g vercel` ou utilisez `npx vercel`.
- Erreur de connexion à la DB : vérifiez `DATABASE_URL`, port (`<DB_PORT>` pour `docker-compose.yml`) et que le container Postgres est en marche (`docker ps`).
- Si TypeScript se plaint de la version Node : utilisez `nvm`/`nvm-windows` ou installez Node 22 (recommandé par `@tsconfig/node22`).

## Structure importante du repo

- `api/` : fonctions API (Vercel)
- `frontend/` et `src/` : code front (Vue 3 + Vite)
- `backend/db/` : configuration Drizzle / accès DB
- `docker-compose.yml` : services de développement (Postgres + Adminer)
- `docker-compose.test.yml` : DB pour tests

Voir le fichier DEVELOPMENT_GUIDELINES.md pour les conventions de développement et bonnes pratiques.
