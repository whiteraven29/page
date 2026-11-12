"""One error format for the whole API, so the frontend handles errors in one place.

{"error": {"status": 400, "code": "invalid", "message": "...", "details": {...}}}
"""

from rest_framework.exceptions import ValidationError
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None  # not an API error: Django returns a 500 and logs it

    data = response.data
    if isinstance(exc, ValidationError):
        message, details = "Some fields need fixing.", data
    elif isinstance(data, dict) and "detail" in data:
        message, details = str(data["detail"]), None
    else:
        message, details = str(exc), None

    response.data = {
        "error": {
            "status": response.status_code,
            "code": getattr(exc, "default_code", "error"),
            "message": message,
            "details": details,
        }
    }
    return response
