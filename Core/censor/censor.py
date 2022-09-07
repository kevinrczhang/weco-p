blacklist= {
 'anal': '',
 'anus': '',
 'ass': '',
 'ass fuck': '',
 'ass hole': '',
 'assfucker': '',
 'asshole': '',
 'assshole': '',
 'bastard': '',
 'bitch': '',
 'black cock': '',
 'boong': '',
 'cock': '',
 'cockfucker': '',
 'cocksuck': '',
 'cocksucker': '',
 'cunt': '',
 'cyberfuck': '',
 'dick': '',
 'douche': '',
 'erection': '',
 'erotic': '',
 'fag': '',
 'faggot': '',
 'fuck': '',
 'Fuck off': '',
 'fuck you': '',
 'fuckass': '',
 'fuckhole': '',
 'gook': '',
 'hard core': '',
 'hardcore': '',
 'homoerotic': '',
 'lesbian': '',
 'lesbians': '',
 'mother fucker': '',
 'motherfuck': '',
 'motherfucker': '',
 'negro': '',
 'nigger': '',
 'orgasim': '',
 'orgasm': '',
 'penis': '',
 'penisfucker': '',
 'porn': '',
 'porno': '',
 'pornography': '',
 'pussy': '',
 'retard': '',
 'sadist': '',
 'sex': '',
 'sexy': '',
 'shit': '',
 'slut': '',
 'son of a bitch': '',
 'suck': '',
 'tits': '',
 'viagra': '',
 'whore': '',
}
class profanity:
    def censor(text):
        words = text.lower().split()
        for word in words:
            for i in blacklist:
                if word in i:
                    return "*"
                if i in word:
                    return "*"


print(profanity.censor("test"))