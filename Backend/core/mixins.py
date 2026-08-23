from django.db import models

from rest_framework import serializers


class RoleFilteredQuerysetMixin:
    """
    Limits list endpoints to the requesting user's own rows for customers.
    Admins see everything. Set `user_filter_field` if the FK is not `user`.
    """

    user_filter_field = 'user'

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user and user.is_authenticated):
            return qs.none()
        if user.role == 'Admin' or user.is_superuser:
            return qs
        return qs.filter(**{self.user_filter_field: user})


class SoftDeleteMixin:
    """
    Flags `is_active=False` instead of deleting when the model supports it.
    Falls back to a hard delete otherwise.
    """

    def perform_destroy(self, instance):
        if isinstance(instance, models.Model) and hasattr(instance, 'is_active'):
            instance.is_active = False
            instance.save(update_fields=['is_active'])
        else:
            instance.delete()


class StrictWriteMixin:
    """
    Rejects unknown fields explicitly instead of silently ignoring them.
    """

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            unexpected = set(self.request.data.keys()) - set(
                serializer.fields.keys()
            )
            if unexpected:
                raise serializers.ValidationError(
                    {field: 'Unknown field.' for field in sorted(unexpected)}
                )
        return serializer
