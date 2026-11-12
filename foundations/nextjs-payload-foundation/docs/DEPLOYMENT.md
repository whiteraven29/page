# Deployment (one Linux server with Docker, behind Cloudflare)

Replace `myapp`, `example.com` and the image name with your own.

## 1. Server (once)

- Ubuntu LTS, 2 vCPU / 4 GB RAM / 80 GB. SSH keys only; firewall open for 22 (restricted), 80 and 443.
- Install Docker Engine and the compose plugin. Turn on unattended security upgrades.
- In Cloudflare: DNS record (proxied), SSL mode **Full (strict)**, and an **Access** application on `example.com/admin*`
  that allows the staff email list. Cache rule: bypass for `/admin*`, `/api/*` and `/next/*`.

## 2. Code and settings

```bash
sudo mkdir -p /srv/myapp && sudo chown $USER /srv/myapp && cd /srv/myapp
git clone <repo-url> .            # only docker/ and .env are needed on the server
cat > .env <<ENV
SITE_DOMAIN=example.com
NEXT_PUBLIC_SERVER_URL=https://example.com
PAYLOAD_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -hex 24)
DATABASE_URL=postgres://app:<POSTGRES_PASSWORD>@db:5432/app
APP_VERSION=1.0.0
ENV
chmod 600 .env
```

`NEXT_PUBLIC_*` values are built into the image. Build one image per environment, or keep these the same everywhere.

## 3. Image

CI (or your machine) builds and pushes the image:

```bash
docker build -t ghcr.io/<owner>/<repo>:v1.0.0 .
docker push ghcr.io/<owner>/<repo>:v1.0.0
```

The first deploy needs the initial migration committed (`src/migrations/`). See ARCHITECTURE.md#database.

## 4. Deploy (every release)

```bash
cd /srv/myapp && APP_IMAGE=ghcr.io/<owner>/<repo>:v1.0.0 ./docker/deploy.sh
```

Migrations run when the app starts. Rollback: run the same command with the previous tag.
Then open `https://example.com/admin` and create the first account, which becomes the admin.

## 5. Backups

```bash
crontab -e
15 2 * * * cd /srv/myapp && BACKUP_REMOTE=offsite:myapp ./docker/backup.sh >> /var/log/myapp-backup.log 2>&1
```

Configure `offsite` with `rclone config`, ideally as a `crypt` remote over S3/R2/Backblaze. Media lives in the `media`
volume until the project moves it to S3/R2; back that up too (`docker run --rm -v myapp_media:/m alpine tar czf - /m`).

**Restore drill (do it once before launch, and note the time it takes):**
`docker compose -f docker/compose.prod.yml exec -T db pg_restore -U app -d app --clean < backups/db-YYYY-MM-DD.dump`

## Troubleshooting

| Symptom | Check |
|---|---|
| 502 from Caddy | `docker compose -f docker/compose.prod.yml logs app` |
| App exits at start | `PAYLOAD_SECRET` or `DATABASE_URL` missing in `.env`; a failing migration |
| Logged out right after login | `NEXT_PUBLIC_SERVER_URL` does not match the real URL (CSRF check rejects the cookie) |
| Images missing after deploy | `media` volume not mounted, or moved without the files |
| Admin unreachable | Cloudflare Access policy: is your email on the list? |
