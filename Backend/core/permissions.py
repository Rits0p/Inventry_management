from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdmin(BasePermission):
    message = 'Only administrators can perform this action.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.role == 'Admin' or user.is_superuser)
        )


class IsCustomer(BasePermission):
    message = 'Only customers can perform this action.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == 'Customer'
        )


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsOwnerOrAdmin(BasePermission):
    message = 'You do not have permission to access this object.'

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.role == 'Admin' or user.is_superuser:
            return True
        owner = getattr(obj, 'user', None) or getattr(obj, 'customer', None)
        return owner == user
