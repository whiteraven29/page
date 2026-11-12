from django.contrib import admin

from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["title", "owner", "pinned", "updated_at"]
    list_filter = ["pinned"]
    search_fields = ["title", "body", "owner__email"]
    raw_id_fields = ["owner"]
