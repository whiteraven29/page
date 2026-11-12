import pytest
from rest_framework.test import APIClient

PASSWORD = "Correct-Horse-42"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def make_user(db, django_user_model):
    def make(email="amina@example.com", password=PASSWORD, **extra):
        return django_user_model.objects.create_user(email=email, password=password, **extra)

    return make


@pytest.fixture
def user(make_user):
    return make_user()


@pytest.fixture
def auth_client(api_client, user):
    """A client already logged in as `user`."""
    api_client.force_authenticate(user=user)
    return api_client
