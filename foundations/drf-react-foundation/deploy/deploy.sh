#!/usr/bin/env bash
# Run on the server from /srv/APP_NAME:  APP=APP_NAME ./deploy/deploy.sh
set -euo pipefail
APP="${APP:?Set APP to the service name}"

git pull --ff-only
backend/.venv/bin/pip install -q -r backend/requirements/prod.txt
(cd backend && DJANGO_SETTINGS_MODULE=config.settings.prod .venv/bin/python manage.py migrate --noinput)
(cd backend && DJANGO_SETTINGS_MODULE=config.settings.prod .venv/bin/python manage.py collectstatic --noinput -v0)
(cd frontend && npm ci --silent && npm run build)
sudo systemctl restart "$APP"
sleep 2
curl -fsS "http://localhost/api/v1/health/" -H "Host: ${DOMAIN:-localhost}" && echo " deploy ok"
