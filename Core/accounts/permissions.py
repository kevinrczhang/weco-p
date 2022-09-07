from rest_framework import permissions
#these will be following permission classes for views/others when they ask for what permission classes are required

class UpdateOwnProfile(permissions.BasePermission):
    #only allow user to edit their own profile
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.id == request.user.id
class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS



