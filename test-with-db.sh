#!/bin/bash
set -e

echo "Loading test environment variables..."
export $(grep -v '^#' .env.test | xargs)

echo "Starting the test Docker database..."
docker compose -f docker-compose.test.yml up -d

echo "Waiting for the database to be available..."
until docker exec bambin_db_test pg_isready -U test; do
  sleep 1
done

echo "Applying Drizzle migrations..."
DATABASE_URL="$DATABASE_URL_TEST" npx drizzle-kit push --config=tsconfig/drizzle.config.ts

echo "Seeding the test database with seed..."
DATABASE_URL="$DATABASE_URL_TEST" npx ts-node backend/db/seed.ts

echo "The test database is ready and seeded..."

echo "Running tests..."
npm run test:db

echo "Stopping and removing the test container..."
docker compose -f docker-compose.test.yml down -v