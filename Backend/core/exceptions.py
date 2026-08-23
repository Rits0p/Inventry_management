from rest_framework.views import APIView, exception_handler as drf_exception_handler
from rest_framework.exceptions import APIException
from rest_framework.response import Response


class BusinessLogicError(APIException):
    status_code = 400
    default_detail = 'A business rule was violated.'
    default_code = 'business_logic_error'


class InsufficientStockError(BusinessLogicError):
    default_detail = 'Not enough stock available for this product.'
    default_code = 'insufficient_stock'


class InvalidOrderStatusError(BusinessLogicError):
    default_detail = 'This order status transition is not allowed.'
    default_code = 'invalid_order_status'


class PaymentRequiredError(BusinessLogicError):
    default_detail = 'Payment information is missing or invalid.'
    default_code = 'payment_required'


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, BusinessLogicError):
            response.data = {
                'detail': str(exc.detail),
                'code': exc.default_code,
            }
        elif isinstance(response.data, dict):
            response.data.setdefault('detail', _first_message(response.data))
        return response

    if isinstance(exc, ValueError):
        return Response(
            {'detail': str(exc), 'code': 'invalid_value'},
            status=400,
        )
    return response


def _first_message(data):
    for key, value in data.items():
        if key == 'detail':
            continue
        if isinstance(value, (list, tuple)) and value:
            value = value[0]
        if isinstance(value, str):
            return value
    return 'An error occurred.'
