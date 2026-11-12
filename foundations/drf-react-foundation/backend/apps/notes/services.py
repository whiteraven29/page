"""Business logic lives here, not in views.

Views handle HTTP. Services hold the rules, so a management command, a Celery task
or another app can reuse them, and tests can call them without HTTP.
"""

from .models import Note


def create_note(*, owner, title, body="", pinned=False):
    return Note.objects.create(owner=owner, title=title, body=body, pinned=pinned)


def notes_for(user):
    """Selector: the only place that decides which notes a user may see."""
    return Note.objects.filter(owner=user)
