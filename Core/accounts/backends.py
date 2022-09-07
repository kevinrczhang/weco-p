from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailOrUsernameModelBackend(ModelBackend):
    def Authenticate(username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            return None
        try:
            email_field = '{}__iexact'.format(UserModel.USERNAME_FIELD)
            user = UserModel._default_manager.get(**{email_field : username})
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None