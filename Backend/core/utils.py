from uuid import uuid4

from django.utils.timezone import now


def generate_order_number(prefix='ORD'):
    timestamp = now().strftime('%Y%m%d%H%M%S')
    unique = uuid4().hex[:6].upper()
    return f'{prefix}-{timestamp}-{unique}'


def get_client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')
