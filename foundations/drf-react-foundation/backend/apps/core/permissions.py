from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Object-level check: only the user in obj.owner may touch the object.

    Also filter the queryset by owner in the view. This permission is the second lock,
    so a mistake in one place does not leak another user's data.
    """

    message = "You do not have access to this item."

    def has_object_permission(self, request, view, obj):
        return getattr(obj, "owner_id", None) == request.user.id
