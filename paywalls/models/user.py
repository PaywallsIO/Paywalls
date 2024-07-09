from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models import EmailField

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS: list[str] = []

    username = None
    email: EmailField = EmailField(unique=True)

    objects = UserManager()