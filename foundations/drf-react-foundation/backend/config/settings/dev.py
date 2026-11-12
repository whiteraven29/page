"""Local development. Never use these settings on a server."""

from .base import *  # noqa: F403
from .base import env

DEBUG = True
SECRET_KEY = env("DJANGO_SECRET_KEY", default="dev-only-insecure-key-change-me")
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# Vite runs on http://localhost:5173 over plain HTTP, so the cookie can't require HTTPS here.
REFRESH_COOKIE["SECURE"] = False  # noqa: F405
