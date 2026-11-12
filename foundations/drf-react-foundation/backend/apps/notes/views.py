from rest_framework import viewsets

from apps.core.permissions import IsOwner

from . import services
from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """CRUD for the logged-in user's notes.

    GET    /api/v1/notes/?search=word&ordering=-updated_at
    POST   /api/v1/notes/
    GET    /api/v1/notes/{id}/
    PATCH  /api/v1/notes/{id}/
    DELETE /api/v1/notes/{id}/
    """

    serializer_class = NoteSerializer
    permission_classes = [*viewsets.ModelViewSet.permission_classes, IsOwner]
    search_fields = ["title", "body"]
    ordering_fields = ["updated_at", "created_at", "title"]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):  # schema generation has no real user
            return Note.objects.none()
        return services.notes_for(self.request.user)

    def perform_create(self, serializer):
        serializer.instance = services.create_note(owner=self.request.user, **serializer.validated_data)
