#!/usr/bin/env bash
# Run on the server from /srv/APP:  APP_IMAGE=ghcr.io/owner/repo:<tag> ./docker/deploy.sh
# Migrations run on start-up (prodMigrations), so a deploy is pull + restart + health check.
# Rollback: run again with the previous image tag.
set -euo pipefail
cd "$(dirname "$0")"
: "${APP_IMAGE:?Set APP_IMAGE to the image tag to deploy}"
export APP_IMAGE

docker compose -f compose.prod.yml --env-file ../.env pull app
docker compose -f compose.prod.yml --env-file ../.env up -d
for i in $(seq 1 30); do
  if docker compose -f compose.prod.yml exec -T app wget -qO- http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "deploy ok: $APP_IMAGE"; exit 0
  fi
  sleep 2
done
echo "health check failed: roll back with the previous APP_IMAGE" >&2
exit 1
