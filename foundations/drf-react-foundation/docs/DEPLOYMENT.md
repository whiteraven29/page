# Deployment (Ubuntu or Debian server)

Replace `myapp`, `example.com` and `deploy` with your app name, domain and Linux user.

## 1. Server packages (once per server)

```bash
sudo apt update
sudo apt install -y python3-venv python3-dev build-essential postgresql nginx git certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Database

```bash
DBPASS=$(openssl rand -hex 24)
sudo -u postgres psql -c "CREATE USER myapp WITH PASSWORD '$DBPASS';"
sudo -u postgres psql -c "CREATE DATABASE myapp OWNER myapp;"
echo "$DBPASS"   # put this into DATABASE_URL below
```

## 3. Code and settings

```bash
sudo mkdir -p /srv/myapp && sudo chown deploy:www-data /srv/myapp
git clone <repo-url> /srv/myapp && cd /srv/myapp
python3 -m venv backend/.venv
backend/.venv/bin/pip install -r backend/requirements/prod.txt
cat > backend/.env <<EOF
DJANGO_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))")
DJANGO_ALLOWED_HOSTS=example.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://example.com
DATABASE_URL=postgres://myapp:<DBPASS>@localhost:5432/myapp
APP_NAME=My App
EOF
chmod 600 backend/.env
```

## 4. Service and web server

```bash
sed "s/APP_NAME/myapp/g; s/DEPLOY_USER/deploy/g" deploy/systemd/gunicorn.service | sudo tee /etc/systemd/system/myapp.service
sed "s/APP_NAME/myapp/g; s/example.com/example.com/g" deploy/nginx/site.conf | sudo tee /etc/nginx/sites-available/myapp
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo systemctl daemon-reload && sudo systemctl enable myapp
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d example.com
```

## 5. First deploy and every deploy after

```bash
cd /srv/myapp
APP=myapp DOMAIN=example.com ./deploy/deploy.sh
DJANGO_SETTINGS_MODULE=config.settings.prod backend/.venv/bin/python backend/manage.py createsuperuser   # first time only
```

## 6. Backups

```bash
sudo mkdir -p /var/backups/myapp && sudo chown postgres /var/backups/myapp
echo '0 2 * * * postgres pg_dump -Fc myapp > /var/backups/myapp/$(date +\%F).dump && find /var/backups/myapp -mtime +14 -delete' | sudo tee /etc/cron.d/myapp-backup
```

Copy backups off the server regularly. To restore: `pg_restore -d myapp --clean <file>.dump`

## Troubleshooting

| Symptom | Check |
|---|---|
| 502 Bad Gateway | `sudo systemctl status myapp`, then `journalctl -u myapp -n 50` |
| Django refuses to start | Missing `DJANGO_SECRET_KEY` or `DJANGO_ALLOWED_HOSTS` in `.env` |
| Logged out on every reload | HTTPS isn't working, so the secure refresh cookie isn't kept |
| Admin page has no styling | Run `collectstatic`, and check the `/static/` alias path in Nginx |
| React page 404 on reload | Check that the `try_files $uri /index.html` line is in the Nginx site |
