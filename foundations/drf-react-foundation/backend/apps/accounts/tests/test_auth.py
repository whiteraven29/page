import pytest
from django.conf import settings

from conftest import PASSWORD

COOKIE = settings.REFRESH_COOKIE["NAME"]
pytestmark = pytest.mark.django_db


def login(client, email="amina@example.com", password=PASSWORD):
    return client.post("/api/v1/auth/login/", {"email": email, "password": password}, format="json")


def test_register_creates_user_and_hides_password(api_client):
    res = api_client.post(
        "/api/v1/auth/register/",
        {"email": "New@Example.com", "password": PASSWORD, "display_name": "New"},
        format="json",
    )
    assert res.status_code == 201
    assert res.json()["email"] == "new@example.com"
    assert "password" not in res.json()


def test_register_rejects_weak_password_and_duplicate_email(api_client, user):
    url = "/api/v1/auth/register/"
    weak = api_client.post(url, {"email": "x@example.com", "password": "123"}, format="json")
    assert weak.status_code == 400
    assert "password" in str(weak.json()["error"]["details"]).lower()
    dup = api_client.post(url, {"email": user.email, "password": PASSWORD}, format="json")
    assert dup.status_code == 400
    assert "email" in dup.json()["error"]["details"]


def test_login_returns_access_in_body_and_refresh_in_httponly_cookie(api_client, user):
    res = login(api_client)
    assert res.status_code == 200
    assert "access" in res.json() and "refresh" not in res.json()
    cookie = res.cookies[COOKIE]
    assert cookie["httponly"] and cookie["path"] == "/api/v1/auth/"


def test_wrong_password_is_401(api_client, user):
    res = login(api_client, password="wrong-password")
    assert res.status_code == 401
    assert res.json()["error"]["status"] == 401


def test_access_token_opens_me(api_client, user):
    access = login(api_client).json()["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    res = api_client.get("/api/v1/auth/me/")
    assert res.status_code == 200
    assert res.json()["email"] == user.email


def test_me_requires_login(api_client):
    assert api_client.get("/api/v1/auth/me/").status_code == 401


def test_refresh_rotates_and_old_token_stops_working(api_client, user):
    login(api_client)
    old = api_client.cookies[COOKIE].value
    res = api_client.post("/api/v1/auth/refresh/")
    assert res.status_code == 200 and "access" in res.json()
    assert api_client.cookies[COOKIE].value != old
    api_client.cookies[COOKIE] = old
    assert api_client.post("/api/v1/auth/refresh/").status_code == 401


def test_refresh_without_cookie_is_401(api_client):
    assert api_client.post("/api/v1/auth/refresh/").status_code == 401


def test_logout_revokes_refresh_token(api_client, user):
    login(api_client)
    token = api_client.cookies[COOKIE].value
    assert api_client.post("/api/v1/auth/logout/").status_code == 204
    api_client.cookies[COOKIE] = token
    assert api_client.post("/api/v1/auth/refresh/").status_code == 401


def test_update_display_name_but_not_email(auth_client, user):
    payload = {"display_name": "Amina", "email": "evil@example.com"}
    res = auth_client.patch("/api/v1/auth/me/", payload, format="json")
    assert res.status_code == 200
    user.refresh_from_db()
    assert user.display_name == "Amina" and user.email == "amina@example.com"
