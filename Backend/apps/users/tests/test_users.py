from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User


class AuthFlowTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.customer = User.objects.create_user(
            'cust@example.com',
            'custpass123',
            role=User.Role.CUSTOMER,
            full_name='Cust Omer',
            phone_number='9876543210',
            address='Old Address',
        )
        cls.profile_url = reverse('profile_update')
        cls.reset_url = reverse('password_reset')
        cls.confirm_url = reverse('password_reset_confirm')
        cls.me_url = reverse('me')

    def test_me_requires_auth(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile(self):
        self.client.force_authenticate(self.customer)
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['fullName'], 'Cust Omer')
        self.assertNotIn('password', response.data)

    def test_update_profile_fields_only(self):
        self.client.force_authenticate(self.customer)
        response = self.client.patch(
            self.profile_url,
            {
                'fullName': 'Updated Name',
                'phone_number': '1112223334',
                'address': 'New Address 42',
                'email': 'hacker@example.com',   # must be ignored
                'role': 'Admin',                  # must be ignored
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertEqual(self.customer.full_name, 'Updated Name')
        self.assertEqual(self.customer.phone_number, '1112223334')
        self.assertEqual(self.customer.address, 'New Address 42')
        # immutable fields untouched
        self.assertEqual(self.customer.email, 'cust@example.com')
        self.assertEqual(self.customer.role, User.Role.CUSTOMER)

    def test_update_profile_requires_auth(self):
        response = self.client.patch(
            self.profile_url, {'fullName': 'Anon'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordResetTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user('reset@example.com', 'oldpass123')
        cls.reset_url = reverse('password_reset')
        cls.confirm_url = reverse('password_reset_confirm')

    @staticmethod
    def _uid_and_token(user):
        return (
            urlsafe_base64_encode(force_bytes(user.pk)),
            default_token_generator.make_token(user),
        )

    def test_request_returns_generic_success_and_sends_email(self):
        response = self.client.post(self.reset_url, {'email': 'reset@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('reset@example.com', mail.outbox[0].to)
        # Link must point at the SPA reset page with uid + token params
        body = mail.outbox[0].body
        self.assertIn('/password-reset?uid=', body)
        self.assertIn('&token=', body)

    def test_request_unknown_email_still_returns_success(self):
        response = self.client.post(self.reset_url, {'email': 'ghost@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_confirm_with_valid_token_resets_password(self):
        uid, token = self._uid_and_token(self.user)
        response = self.client.post(
            self.confirm_url,
            {'uid': uid, 'token': token, 'new_password': 'brandnew456'},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('brandnew456'))

    def test_confirm_with_invalid_token_rejected(self):
        uid, _ = self._uid_and_token(self.user)
        response = self.client.post(
            self.confirm_url,
            {'uid': uid, 'token': 'bogus-token', 'new_password': 'brandnew456'},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('oldpass123'))

    def test_confirm_with_invalid_uid_rejected(self):
        _, token = self._uid_and_token(self.user)
        response = self.client.post(
            self.confirm_url,
            {'uid': 'AAAA', 'token': token, 'new_password': 'brandnew456'},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm_weak_password_rejected(self):
        uid, token = self._uid_and_token(self.user)
        response = self.client.post(
            self.confirm_url,
            {'uid': uid, 'token': token, 'new_password': 'reset@example.com'},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
