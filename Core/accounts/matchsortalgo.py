#------------------------------------new algorithm-----------------------------------
from collections import OrderedDict
"""
current_user - the user making the request and their interests
inverted group - is exactly as the people dictionary as you see below, but ordered as 'interest' : ['person1', 'person2']...etc

The concept behind this algorithm to compare every j'th interest(key) of inverted group with the i'th interest(key) of current_user.
To do this, for every i incremented by one, j is looped through the entire inverted_group's length of interests
For example: current_user has 2 interests, inverted_group has 13 interests]
i represents the current current_user's interest, while j is the current inverted_group's interest
everytime j reaches 13, it gets reset and i is incremented by 1. This will allow every interest of inverted_group to be compared with 
every interest of current_user

in other words, we increment j by one every time , which is equivalent to getting every interest in inverted_group. We then take this value and 
compare it with the i'th value of the user's interest. Doing this will compare all 13 interests with the i'th interest of current_user
"""
people = {
'person1': ['interest','interest3', 'interest4', 'interest5'], 
'person2': ['interest', 'interest4', 'interest5','interest6','interest2','interest9','interest3'],
'person3': ['interest6 ', 'interest4', 'interest5', 'interest3', 'interest2', 'interest', 'interest10'],
'person4': ['interest7', 'interest4', 'interest6','interest8','interest9','interest10'],
'person6': ['interest', 'interest4','interest5', 'interest6','interest7','interest8','interest9'],
'person7': ['interest', 'interest3', 'interest2', 'interest1','interest6','interest7','interest8'],
'person8': ['interest', 'interest4', 'interest5','interest6','interest7'],
'person10': ['interest3', 'interest4', 'interest6','interest7','interest8','interest9'],
'person11': ['interest', 'interest7', 'interest8', 'interest5'],
'person12': ['interest2', 'interest4', 'interest8','interest9', 'interest10', 'interest3', 'interest7', 'interest6'],
'person13': ['interest5', 'interest6', 'interest10', 'interest7', 'interest2'],
'person14': ['interest3', 'interest4', 'interest8', 'interest10', 'interest9', 'interest7'],
'person15': ['interest', 'interest4', 'interest5', 'interest6', 'interest8', 'interest0'],
}
current_user = people.get('person3') #request.user
people.pop('person3') #remove current user from matching list

#print(current_user[2])
#quit()
inverted_group = {}
for key, value in person.items():
    for x in value:
        inverted_group.setdefault(x, list()).append(key)
#print(len(list(inverted_group.keys())))
#print(inverted_group["interest"])
#print(len(inverted_group))
#print(len(current_user))
#quit()

i = 0 #will be used to iterate through interests
j = 0 #will be used to iterate through the current user's interests
once = False#just ot make sure we only assign inverted_group's length to length once
length = 0
raw_matches = []

#this will stop the algo if we have reached the end of the user's interests. 
while i < len(current_user) or j < length: 
    if once == False:
       once = True
       length = len(inverted_group)
    if current_user[i] == list(inverted_group.keys())[j]: #if the j'th value of inverted_group is equal to the i'th value of current_user
        j += 1
        raw_matches.extend(inverted_group[current_user[i]])#add the values(people) of the dict into raw_matches
        #NOTE: need to do .extend() to get all values of list in existing list
            
    else: # if no matches, then move on onto the next interest in inverted_group
        j+=1
        if j == length: #if j reaches the end of inverted_group, then reset every value and move on to the next interest in current_user
            i += 1 
            j = 0
            length = 0
            once = False
            continue
"""         
    if j == length: #reset everything and move onto the next interest
        i += 1 
        j = 0 
        once = False
        length = 0
"""
final_matches = list(OrderedDict.fromkeys(raw_matches)) #removes duplicates in raw_matches


                

#print('group ', interest_group,'\n') #this could be for posts section
print('matches: ', final_matches,'\n')

#------------------------------------------------------extracting location matched------------------------------------------
test = {
    "3": [
        {
            "id": 32589021,
            "username": "dragolla",
            "profile_image": "https://weco-static.s3.amazonaws.com/profilepicture.jpg",
            "interests": [
                1,
                3
            ],
            "biography": "",
            "tags": [
                "swimming"
            ]
        }
    ],
    "5": [
        {
            "id": 578172410,
            "username": "teststs",
            "profile_image": "https://weco-static.s3.amazonaws.com/profilepicture.jpg",
            "interests": [
                5
            ],
            "biography": "",
            "tags": [
                "coding"
            ]
        }
    ]
}  
location = {
    578172410 : 
                {
            "id": 578172410,
            "username": "teststs",
            "profile_image": "https://weco-static.s3.amazonaws.com/profilepicture.jpg",
            "interests": [
                5
            ],
            "biography": "",
            "tags": [
                "coding"
            ],
            "matchedInterests":
                [
                "running",
                "swimming"
                ],
        }
        
    
    
}
for k,v in test.items():
    for x in v:
        if x['id'] in location:
            location[x['id']]['matchedInterests'].extend(["coding"])
        else:
            location[x['id']] = x
            location[x['id']]['matchedInterests'] = ['swimming', 'running']
            #print(location[x['id']])
            
print(location)


# ---------------------------------------------------OLD ALGORITHM---------------------------------------------------------
people = {
'person1': ['interest','interest3', 'interest4', 'interest5'], 
'person2': ['interest', 'interest4', 'interest5','interest6','interest2','interest9','interest3'],
'person3': ['interest6 ', 'interest4', 'interest5', 'interest3', 'interest2', 'interest', 'interest10'],
'person4': ['interest7', 'interest4', 'interest6','interest8','interest9','interest10'],
'person6': ['interest', 'interest4','interest5', 'interest6','interest7','interest8','interest9'],
'person7': ['interest', 'interest3', 'interest2', 'interest1','interest6','interest7','interest8'],
'person8': ['interest', 'interest4', 'interest5','interest6','interest7'],
'person10': ['interest3', 'interest4', 'interest6','interest7','interest8','interest9'],
'person11': ['interest', 'interest7', 'interest8', 'interest5'],
'person12': ['interest2', 'interest4', 'interest8','interest9', 'interest10', 'interest3', 'interest7', 'interest6'],
'person13': ['interest5', 'interest6', 'interest10', 'interest7', 'interest2'],
'person14': ['interest3', 'interest4', 'interest8', 'interest10', 'interest9', 'interest7'],
'person15': ['interest', 'interest4', 'interest5', 'interest6', 'interest8', 'interest0'],
}
current_user = people.get('person3') #request.user
people.pop('person3') #remove current user from matching list
choice = people #new list
location = {}#where the users matched
seen = [] #to remove duplicate matches
match_group =[] # matches
person = {}
interest_group = {}
#------------------------------part 1----------------------------------
#sample result: {"person1": ["interest", "interest3", "interest4"] }
for i in choice:
    if i in choice:
        match = choice.get(i)
        for k in range(len(match)):
            person[i] = match
    else:
        print("Uh oh, I don't know about that item")

#----------------------------part 2------------------------------------
# invert the group for matching
inverted_group = {}
for key, value in person.items():
    for x in value:
        inverted_group.setdefault(x, list()).append(key)

#invert context dictionary in everything
#inverted_group = {'interest': ['person1'], 'interest4': ['person1']...etc}
#----------------------------part 3------------------------------------
#remove duplicate users in interests
#return True if seen, False if not
def spotted(person, plist):
    for i in plist:
        if(i == person):
            return True #has been spotted
    return False #has not been seen
#----------------------------part 4------------------------------------
#start matching the users
for i in current_user: #interest3
    for n in inverted_group: #interest3
        if n == i: #interest3 == interest3
            p = inverted_group.get(i)
            for x in p:
                location.setdefault(x, list()).append(n)
                 #put all seen people into seen list
                if(spotted(x, seen) == False): #if spotted returns False, which means person is not in list 
                    match_group.append(x) #get all values from context dictionary key and put them into match_group
                    seen.append(x)
for key, value in location.items():
    for x in value:
        interest_group.setdefault(x, list()).append(key)                    

print('group ', interest_group,'\n') #NOTE: this could be for posts section, but would require a model to do so 
print('matches: ', match_group,'\n')
print('location matched: ', location, '\n')

#Same algorithm, just no comments
people = {
'person1': ['interest','interest3', 'interest4', 'interest5'], 
'person2': ['interest', 'interest4', 'interest5','interest6','interest2','interest9','interest3'],
'person3': ['interest6 ', 'interest4', 'interest5', 'interest3', 'interest2', 'interest', 'interest10'],
'person4': ['interest7', 'interest4', 'interest6','interest8','interest9','interest10'],
'person6': ['interest', 'interest4','interest5', 'interest6','interest7','interest8','interest9'],
'person7': ['interest', 'interest3', 'interest2', 'interest1','interest6','interest7','interest8'],
'person8': ['interest', 'interest4', 'interest5','interest6','interest7'],
'person10': ['interest3', 'interest4', 'interest6','interest7','interest8','interest9'],
'person11': ['interest', 'interest7', 'interest8', 'interest5'],
'person12': ['interest2', 'interest4', 'interest8','interest9', 'interest10', 'interest3', 'interest7', 'interest6'],
'person13': ['interest5', 'interest6', 'interest10', 'interest7', 'interest2'],
'person14': ['interest3', 'interest4', 'interest8', 'interest10', 'interest9', 'interest7'],
'person15': ['interest', 'interest4', 'interest5', 'interest6', 'interest8', 'interest0'],
}
current_user = people.get('person3')
people.pop('person3')
choice = people
location = {}
seen = [] 
match_group =[]
person = {}
interest_group = {}

for i in choice:
    if i in choice:
        match = choice.get(i)
        for k in range(len(match)):
            person[i] = match
    else:
        print("Uh oh, I don't know about that item")

inverted_group = {}
for key, value in person.items():
    for x in value:
        inverted_group.setdefault(x, list()).append(key)

def spotted(person, plist):
    for i in plist:
        if(i == person):
            return True 
    return False 
#for current user
var = 0; 
#for dictionary
var2 = 0;
for i in current_user:
    while current_user[var] == inverted_group.keys[var2]:
        p = inverted_group.get(i)
        #try a faster time complexity here, put while loop inside for loop
        for x in p:
            location.setdefault(x, list()).append(n)
            if(spotted(x, seen) == False): 
                match_group.append(x) 
                seen.append(x)
    var += 1
    var2 += 1
                    
for key, value in location.items():
    for x in value:
        interest_group.setdefault(x, list()).append(key)                    

print('group ', interest_group,'\n') 
print('matches: ', match_group,'\n')
print('location matched: ', location, '\n')



#new algorithm 
while len(test1) is not 0:
    j = 0
    for i in test2:
        if test2 = test1.get(j):
            j += 1
            continue 

"""
#old algorithm
        for user in users.data:
             matchedInterests=[]
             for userInterest in user['interests']:
                  for _selfInterest in _self.data['interests']:
                       if userInterest == _selfInterest:
                            matchedInterests.append(userInterest)
                            user['matchedPercentage']=((len(matchedInterests)+1)/(len(user['interests'])+2)+(len(matchedInterests)+1)/(len(_self.data['interests'])+2))/2
                            user['matchedInterests']=matchedInterests
                            matchedUsers.append(user)
                            match=True
                            break
        for user in users.data:
                    matchedInterestsTags=[]
                    for userInterestTags in user['tags']:
                        for _selfTags in _self.data['tags']:
                            if userInterestTags == _selfTags:
                                matchedInterestsTags.append(userInterestTags)
                                user['matchedTags']=matchedInterestsTags
                                matchedUsers.append(user)
                                match=True                              
                                break
"""
"""
        limit = request.GET.get('l')
        offset = request.GET.get('o')
        modified_group = transform(request, "interest")
        if limit and offset:
            _self = UserProfileInfoBoxSerializer(request.user)
            queryset = UserProfileInfo.objects.all().exclude(id=request.user.id)[:int(offset) + int(limit)]
            users = UserProfileInfoBoxSerializer(queryset, many=True)
            matchedUsers = []
        else:
            return Response("Either offset or limit is missing")
        i = 0 #will be used to iterate through interests
        j = 0 #will be used to iterate through the current user's interests
        once = False#just ot make sure we only assign inverted_group's length to length once
        length = 0
        raw_matches = []
        interests_location = {}
        tags_location = {}
        #return Response(modified_group)
        #this will stop the algo if we have reached the end of the user's interests. 
        while i < len(_self.data['interests']) or j < length: 
            #matchedInterests = []
            if once == False:
                once = True
                length = len(modified_group)
            if _self.data['interests'][i] == list(modified_group.keys())[j]: #if the j'th value of inverted_group is equal to the i'th value of current_user
                j += 1
                interests_location[_self.data['interests'][i]] = modified_group[_self.data['interests'][i]] 
                #matchedInterests.append(_self.data['interests'][i]) 
                #user['matchedPercentage']=((len(matchedInterests)+1)/(len(user['interests'])+2)+(len(matchedInterests)+1)/(len(_self.data['interests'])+2))/2
                users = modified_group[_self.data['interests'][i]] 
                for user in users: #for each user
                    if "matched_interests" in user:
                        user["matched_interests"].extend(_self.data['interests'][i])
                    else:
                        user['matched_interests'] = [_self.data['interests'][i]]
                raw_matches.extend(users)
                #raw_matches.extend([dict(item, **{'matchedInterest':matchedInterests}) for item in user])#add the values(people) of the dict into raw_matches
                #NOTE: need to do .extend() to get all values of list in existing list
                    
            else: # if no matches, then move on onto the next interest in inverted_group
                j+=1
                if j == length: #if j reaches the end of inverted_group, then reset every value and move on to the next interest in current_user
                    i += 1 
                    j = 0
                    length = 0
                    once = False
                    continue
              
            if j == length: #reset everything and move onto the next interest
                i += 1 
                j = 0 
                once = False
                length = 0
        #return Response( modified_group[_self.data['interests'][0]]) 

        i = 0 
        j = 0 
        once = False
        length = 0
        modified_group = transform(request, "tag")
        #return Response(modified_group)
        while i < len(_self.data['tags']) or j < length: 
            #matchedTags = []
            if once == False:
                once = True
                length = len(modified_group)
            if _self.data['tags'][i] == list(modified_group.keys())[j]: #if the j'th value of inverted_group is equal to the i'th value of current_user     
                j += 1
                tags_location[_self.data['tags'][i]] = modified_group[_self.data['tags'][i]]
                #matchedTags.append(_self.data['tags'][i]) 
                #user['matchedPercentage']=((len(matchedInterests)+1)/(len(user['interests'])+2)+(len(matchedInterests)+1)/(len(_self.data['interests'])+2))/2
                users = modified_group[_self.data['tags'][i]] 
                for user in users: #for each user
                    if "matched_tags" in user:
                        user["matched_tags"].extend(_self.data['tags'][i])
                    else:
                        user['matched_tags'] = [_self.data['tags'][i]]
                raw_matches.extend(users)
                #raw_matches.extend([dict(item, **{'matchedTags':matchedTags}) for item in user])#add the values(people) of the dict into raw_matches
                #NOTE: need to do .extend() to get all values of list in existing list
                    
            else: # if no matches, then move on onto the next interest in inverted_group
                j+=1
                if j == length: #if j reaches the end of inverted_group, then reset every value and move on to the next interest in current_user
                    i += 1 
                    j = 0
                    length = 0
                    once = False
                    continue
                
            if j == length: #reset everything and move onto the next interest
                i += 1 
                j = 0 
                once = False
                length = 0

        #removes duplicates in raw_matches, now contains dictionaries that have matchedTags...but some DON'T have matchedTags
        cleaned_matches = [i for n, i in enumerate(raw_matches) if i not in raw_matches[n + 1:]] 
        final_matches = []
        #Here we take all the dictionaries with matchedTags, and save those into the final match list. Complete!
        """for m in cleaned_matches: 
            if "matchedTags" in m:
                final_matches.append(m)  
         
            """

        context= {
            "matchedUsers": cleaned_matches,
            "has_more": more_matches(request)
        }
        return Response(context)
"""