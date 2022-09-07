from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from accounts.models import UserProfileInfo, icon

# class UserCreateForm(UserCreationForm):
#     class Meta:
#         fields = ("username", "email", "password1", "password2")
#         model = get_user_model()

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.fields["username"].label = "Display name"
#         self.fields["email"].label = "Email address"

class UserForm(forms.ModelForm): #password is getting through forms, and uncontrollable field in forms
    
    password = forms.CharField(widget=forms.PasswordInput())
    class Meta():
        model = UserProfileInfo
        # todo: add ability to select multiple interests,
        #       update user interests in profile
        fields = ('username','email','password', 'profile_pic', 'interests',)

class IconForm(forms.ModelForm):
    class Meta():
        model = icon
        fields = ('icon_image', )

class UserProfileInfoForm(forms.ModelForm):
    class Meta():
        model = UserProfileInfo
        fields = ()