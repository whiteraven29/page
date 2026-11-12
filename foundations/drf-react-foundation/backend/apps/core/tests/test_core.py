from rest_framework.exceptions import NotFound, ValidationError

from apps.core.exceptions import api_exception_handler


def test_health_is_public_and_reports_database(api_client, db):
    res = api_client.get("/api/v1/health/")
    assert res.status_code == 200
    assert res.json()["database"] == "ok"


def test_validation_errors_use_the_standard_shape():
    res = api_exception_handler(ValidationError({"title": ["Required."]}), {})
    assert res.data["error"]["code"] == "invalid"
    assert res.data["error"]["details"] == {"title": ["Required."]}


def test_other_errors_use_the_standard_shape():
    res = api_exception_handler(NotFound(), {})
    assert res.status_code == 404
    assert res.data["error"]["code"] == "not_found"
    assert res.data["error"]["details"] is None


def test_schema_and_docs_are_served(api_client, db):
    assert api_client.get("/api/v1/schema/").status_code == 200
    assert api_client.get("/api/v1/docs/").status_code == 200
