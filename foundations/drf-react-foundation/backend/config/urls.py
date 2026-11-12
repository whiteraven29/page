from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # Every API route is versioned. A breaking change goes in api/v2/ beside v1.
    path("api/v1/", include("config.api_v1")),
]
