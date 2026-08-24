from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'fullName', 'role', 'phone_number', 'address']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(
        source='full_name', required=False, allow_blank=True, max_length=150
    )

    class Meta:
        model = User
        fields = ['fullName', 'phone_number', 'address']

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_uid(self, value):
        try:
            user_id = force_str(urlsafe_base64_decode(value))
            self._user = User.objects.get(pk=user_id)
        except Exception:
            raise serializers.ValidationError('Invalid reset link.')
        return value

    def validate(self, attrs):
        user = getattr(self, '_user', None)
        if user is None or not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'token': 'Invalid or expired reset link.'})
        validate_password(attrs['new_password'], user=user)
        return attrs

    def save(self):
        self._user.set_password(self.validated_data['new_password'])
        self._user.save(update_fields=['password'])
        return self._user


class RegisterSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', max_length=150)
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['fullName', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Invalid email or password.',
    }

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_old_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
