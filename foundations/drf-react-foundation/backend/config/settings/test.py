"""Settings for pytest. Fast and predictable."""

from .base import *  # noqa: F403
from .base import env

DEBUG = False
SECRET_KEY = "test-only-key"  # noqa: S105 - tests only
ALLOWED_HOSTS = ["testserver", "localhost"]
DATABASES = {"default": env.db("DATABASE_URL", default="sqlite:///:memory:")}

# Hashing passwords properly is slow on purpose. Tests don't need that.
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

REST_FRAMEWORK = {
    **REST_FRAMEWORK,  # noqa: F405
    "DEFAULT_THROTTLE_RATES": {"anon": "10000/min", "user": "10000/min", "auth": "10000/min"},
}
REFRESH_COOKIE["SECURE"] = False  # noqa: F405
LOGGING["root"]["level"] = "WARNING"  # noqa: F405
