# Run `make help` to see everything. Commands assume Linux, macOS or WSL with nvm.
SHELL := /bin/bash
NODE := source $$HOME/.nvm/nvm.sh >/dev/null 2>&1; nvm use >/dev/null 2>&1;

.PHONY: help setup dev db db-stop seed types importmap test test-e2e lint typecheck check build start migrate-create migrate clean

help: ## Show this list
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-16s %s\n", $$1, $$2}'

setup: ## First-time setup: Node version, packages, .env with a random secret
	$(NODE) npm ci
	test -f .env || (cp .env.example .env && sed -i.bak "s/^PAYLOAD_SECRET=.*/PAYLOAD_SECRET=$$(openssl rand -hex 32)/" .env && rm -f .env.bak)
	@echo "Next: make dev, then open http://localhost:3000/admin and create the first (admin) account."

dev: ## Run the site and admin on http://localhost:3000
	$(NODE) npm run dev

db: ## Start PostgreSQL in Docker (then set DATABASE_URL in .env)
	docker compose up -d db

db-stop: ## Stop PostgreSQL
	docker compose stop db

seed: ## Create the first admin (SEED_ADMIN_EMAIL/PASSWORD) and sample content
	$(NODE) npm run seed

types: ## Regenerate src/payload-types.ts after changing collections or globals
	$(NODE) npm run generate:types

importmap: ## Regenerate the admin import map after adding custom admin components
	$(NODE) npm run generate:importmap

test: ## Integration + unit tests (fresh SQLite, or TEST_DATABASE_URL=postgres://...)
	$(NODE) npm test

test-e2e: ## Browser smoke tests (needs: npx playwright install chromium)
	$(NODE) npm run test:e2e

lint: ## ESLint
	$(NODE) npm run lint

typecheck: ## TypeScript
	$(NODE) npm run typecheck

check: types lint typecheck test ## Everything CI runs except the build
	@git diff --exit-code -- src/payload-types.ts || (echo "payload-types.ts was out of date: commit the regenerated file" && exit 1)

build: ## Production build (no database needed)
	$(NODE) PAYLOAD_DISABLE_JOBS=true npm run build

start: ## Run the production build
	$(NODE) npm run start

migrate-create: ## New migration from schema changes: make migrate-create name=add_notices (needs PostgreSQL)
	@test -n "$(name)" || (echo "Usage: make migrate-create name=<what_changed>" && exit 1)
	$(NODE) npm run payload migrate:create $(name)

migrate: ## Apply pending migrations to DATABASE_URL (PostgreSQL)
	$(NODE) npm run payload migrate

clean: ## Remove build output, caches and local test data (keeps dev.db and media/)
	rm -rf .next .tmp test-results playwright-report
