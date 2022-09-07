def spotted(person, plist):
    for i in plist:
        if(i == person):
            return True #has been spotted
    return False #has not been seen

def transform(request, value_type):
    if value_type == "interest":
        storage = {}
        allint = Interests.objects.all()
        for i in allint:
            storage[i.id] = UserProfileInfoBoxSerializer(i.userprofileinfo_set.all().exclude(id=request.user.id), many=True).data
        return storage

    elif value_type == "tag":
        storage = {}
        alltags = InterestTags.objects.all()
        for t in alltags:
            storage[t.interest_tag_name] = UserProfileInfoBoxSerializer(t.userprofileinfo_set.all().exclude(id=request.user.id), many=True).data
        return storage
#returns the users's interests or tags as keys to a dictionary with value of "placeholder"
def transform_user(user, value_type):
    if value_type == 'interest':
        for interest in user['interests']:
            user[interest] = "placeholder"
        user.pop('interests')
        user.pop('tags')
        user.pop('username')
        user.pop('profile_image')
        user.pop('biography')
    if value_type == 'tag':
        for tag in user['tags']:
            user[tag] = "placeholder"
        user.pop('interests')
        user.pop('tags')
        user.pop('username')
        user.pop('profile_image')
        user.pop('biography')

    return user