import pytest

from apps.notes.services import create_note

pytestmark = pytest.mark.django_db
URL = "/api/v1/notes/"


def test_create_and_list_own_notes(auth_client, user):
    res = auth_client.post(URL, {"title": "  First  ", "body": "hello"}, format="json")
    assert res.status_code == 201
    assert res.json()["title"] == "First"
    listing = auth_client.get(URL).json()
    assert listing["count"] == 1
    assert listing["results"][0]["title"] == "First"


def test_users_cannot_see_or_change_each_others_notes(auth_client, make_user):
    other = make_user(email="joel@example.com")
    theirs = create_note(owner=other, title="Private")
    assert auth_client.get(URL).json()["count"] == 0
    assert auth_client.get(f"{URL}{theirs.id}/").status_code == 404
    assert auth_client.patch(f"{URL}{theirs.id}/", {"title": "x"}, format="json").status_code == 404
    assert auth_client.delete(f"{URL}{theirs.id}/").status_code == 404


def test_anonymous_users_get_401(api_client):
    assert api_client.get(URL).status_code == 401


def test_pinned_notes_come_first_and_search_works(auth_client, user):
    create_note(owner=user, title="Groceries")
    create_note(owner=user, title="Deploy checklist", pinned=True)
    titles = [n["title"] for n in auth_client.get(URL).json()["results"]]
    assert titles == ["Deploy checklist", "Groceries"]
    found = auth_client.get(URL, {"search": "groc"}).json()["results"]
    assert [n["title"] for n in found] == ["Groceries"]


def test_blank_title_is_rejected(auth_client):
    res = auth_client.post(URL, {"title": "   "}, format="json")
    assert res.status_code == 400
    assert "title" in res.json()["error"]["details"]


def test_update_and_delete(auth_client, user):
    note = create_note(owner=user, title="Old")
    assert auth_client.patch(f"{URL}{note.id}/", {"pinned": True}, format="json").json()["pinned"] is True
    assert auth_client.delete(f"{URL}{note.id}/").status_code == 204
    assert auth_client.get(URL).json()["count"] == 0
