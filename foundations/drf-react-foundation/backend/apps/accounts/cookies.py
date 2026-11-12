"""Helpers for the refresh-token cookie. Keep all cookie settings in one place."""

from django.conf import settings


def set_refresh_cookie(response, token):
    c = settings.REFRESH_COOKIE
    response.set_cookie(
        c["NAME"],
        token,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        httponly=True,
        secure=c["SECURE"],
        samesite=c["SAMESITE"],
        path=c["PATH"],
    )


def clear_refresh_cookie(response):
    c = settings.REFRESH_COOKIE
    response.delete_cookie(c["NAME"], path=c["PATH"], samesite=c["SAMESITE"])


def read_refresh_cookie(request):
    return request.COOKIES.get(settings.REFRESH_COOKIE["NAME"])
