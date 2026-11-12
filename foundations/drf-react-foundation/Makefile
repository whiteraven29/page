# Run `make help` to see everything. Commands assume Linux or WSL.
PY := backend/.venv/bin/python
PIP := backend/.venv/bin/pip
MANAGE := cd backend && .venv/bin/python manage.py

.PHONY: help setup hooks db db-stop backend frontend migrate migrations superuser test test-backend test-frontend lint fmt check app clean

help: ## Show this list
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-16s %s\n", $$1, $$2}'

setup: ## First-time setup: venv, packages, .env files, database
	python3 -m venv backend/.venv
	$(PIP) install -r backend/requirements/dev.txt
	test -f backend/.env || cp backend/.env.example backend/.env
	cd frontend && npm install
	$(MANAGE) migrate

hooks: ## Install the git pre-commit hooks
	backend/.venv/bin/pre-commit install

db: ## Start PostgreSQL in Docker (then set DATABASE_URL in backend/.env)
	docker compose up -d db

db-stop: ## Stop PostgreSQL
	docker compose stop db

backend: ## Run Django on http://127.0.0.1:8000
	$(MANAGE) runserver 127.0.0.1:8000

frontend: ## Run Vite on http://localhost:5173 (open this one in the browser)
	cd frontend && npm run dev

migrations: ## Create migrations after changing models
	$(MANAGE) makemigrations

migrate: ## Apply migrations
	$(MANAGE) migrate

superuser: ## Create an admin login for /admin/
	$(MANAGE) createsuperuser

test: test-backend test-frontend ## Run every test

test-backend: ## Backend tests with coverage
	cd backend && .venv/bin/pytest --cov=apps --cov-report=term-missing

test-frontend: ## Frontend tests
	cd frontend && npm test

lint: ## Check code style and common bugs
	cd backend && .venv/bin/ruff check . && .venv/bin/ruff format --check .
	cd frontend && npm run lint

fmt: ## Auto-fix formatting
	cd backend && .venv/bin/ruff check --fix . && .venv/bin/ruff format .

check: lint test ## Everything CI runs
	$(MANAGE) makemigrations --check --dry-run

app: ## New backend app from the template: make app name=projects
	@test -n "$(name)" || (echo "Usage: make app name=<app_name>" && exit 1)
	mkdir -p backend/apps/$(name)
	$(MANAGE) startapp $(name) apps/$(name) --template templates/app_template
	@echo "Next: add \"apps.$(name)\" to LOCAL_APPS in config/settings/base.py,"
	@echo "      add path(\"$(name)/\", include(\"apps.$(name).urls\")) to config/api_v1.py,"
	@echo "      then run: make migrations migrate test"

clean: ## Remove caches and build output
	rm -rf backend/.pytest_cache backend/.ruff_cache backend/htmlcov frontend/dist
