from django.db import models


class TimeStampedModel(models.Model):
    """Base for most models: records when a row was created and last changed."""

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
