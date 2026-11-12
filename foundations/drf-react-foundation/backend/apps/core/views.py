from django.conf import settings
from django.db import connection
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """Used by uptime monitors, load balancers and the deploy script."""

    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = []

    @extend_schema(
        responses=inline_serializer(
            "Health",
            {
                "status": serializers.CharField(),
                "database": serializers.CharField(),
                "version": serializers.CharField(),
            },
        )
    )
    def get(self, request):
        try:
            connection.ensure_connection()
            db = "ok"
        except Exception:  # noqa: BLE001 - report any database failure as unhealthy
            db = "unavailable"
        healthy = db == "ok"
        return Response(
            {"status": "ok" if healthy else "degraded", "database": db, "version": settings.APP_VERSION},
            status=status.HTTP_200_OK if healthy else status.HTTP_503_SERVICE_UNAVAILABLE,
        )
