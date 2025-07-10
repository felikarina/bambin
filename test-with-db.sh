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

echo "Dropping all tables in the test database..."
docker exec bambin_db_test psql -U test -d bambin_test -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "Applying Drizzle schema..."
npx drizzle-kit push --config=tsconfig/drizzle.config.ts

echo "Seeding the test database with seed..."
npx ts-node backend/db/seed.ts

echo "The test database is ready and seeded..."

echo "Installing Playwright browsers..."
npx playwright install chromium

echo "Running Playwright E2E tests..."
npm run test:e2e

echo "Stopping and removing the test container..."
docker compose -f docker-compose.test.yml down -v