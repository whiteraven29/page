#!/usr/bin/env bash
# Nightly database backup. Cron on the server, for example:
#   15 2 * * * cd /srv/APP && ./docker/backup.sh >> /var/log/APP-backup.log 2>&1
# Off-site copy: set BACKUP_REMOTE to an rclone remote (use an rclone "crypt" remote to encrypt).
set -euo pipefail
cd "$(dirname "$0")"
STAMP=$(date +%F)
OUT="../backups/db-$STAMP.dump"
mkdir -p ../backups

docker compose -f compose.prod.yml exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > "$OUT"
echo "$(date -Is) wrote $OUT ($(du -h "$OUT" | cut -f1))"

if [ -n "${BACKUP_REMOTE:-}" ]; then
  rclone copy "$OUT" "$BACKUP_REMOTE/daily/"
  # Keep the first backup of each month as a monthly copy.
  [ "$(date +%d)" = "01" ] && rclone copy "$OUT" "$BACKUP_REMOTE/monthly/"
  rclone delete --min-age 30d "$BACKUP_REMOTE/daily/"
fi

# Local copies: one week is enough when the remote holds 30 days.
find ../backups -name 'db-*.dump' -mtime +7 -delete
# Restore: docker compose -f compose.prod.yml exec -T db pg_restore -U app -d app --clean < backups/db-YYYY-MM-DD.dump
