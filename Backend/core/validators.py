from django.core.validators import RegexValidator
from django.utils.deconstruct import deconstructible

from rest_framework import serializers


@deconstructible
class PhoneNumberValidator(RegexValidator):
    regex = r'^\+?[0-9]{7,15}$'
    message = 'Enter a valid phone number (7-15 digits, optional leading +).'
    code = 'invalid_phone'


validate_phone_number = PhoneNumberValidator()


def validate_positive_price(value):
    if value is None or value <= 0:
        raise serializers.ValidationError('Price must be greater than zero.')
    if value > 99999999.99:
        raise serializers.ValidationError('Price is unreasonably large.')


def validate_non_negative_quantity(value):
    if value is None or value < 0:
        raise serializers.ValidationError('Quantity cannot be negative.')


def validate_rating(value):
    if value is None:
        return
    if not (0 <= value <= 5):
        raise serializers.ValidationError('Rating must be between 0 and 5.')
