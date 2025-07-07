#!/bin/bash
set -e

echo "Chargement des variables d'environnement de test..."
export $(grep -v '^#' .env.test | xargs)

echo "Démarrage de la base de test Docker..."
docker-compose -f docker-compose.test.yml up -d

echo "Attente de la disponibilité de la base..."
until docker exec bambin_db_test pg_isready -U test; do
  sleep 1
done

echo "Application des migrations Drizzle..."
DATABASE_URL="$DATABASE_URL_TEST" npx drizzle-kit push --config=tsconfig/drizzle.config.ts

echo "Seeding the test database with seed..."
DATABASE_URL="$DATABASE_URL_TEST" npx ts-node api/db/seed.ts

echo "La base de test est prête et peuplée..."

echo "Lancement des tests..."
npm run test:db

echo "Arrêt et suppression du conteneur de test..."
docker-compose -f docker-compose.test.yml down -v