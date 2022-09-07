from rest_framework import permissions

#checks if the object the user is requesting belongs to the user
class IsCurrentUser(permissions.BasePermission):
    #only allow user to edit their own profile
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
