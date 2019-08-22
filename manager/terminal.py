# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


'''
Standard terminal color and style codes.
usages:
from terminal import tsencode
tsencode(string, 'red')
tsencode(string, ['red', 'bold'])
'''


class TERMINAL_STYLE_CODE:

    RESET = '\033[0m'

    BOLD = '\033[1m'
    DIM = '\033[2m'
    ITALIC = '\033[3m'
    UNDERLINE = '\033[4m'
    BLINK = '\033[5m'
    INVERSE = '\033[7m'
    HIDDEN = '\033[8m'
    STRIKEOUT = '\033[9m'
    STRIKETHROUGH = '\033[9m'

    RESETBOLD = '\033[21m'
    RESETDIM = '\033[22m'
    RESETITALIC = '\033[23m'
    RESETUNDERLINE = '\033[24m'
    RESETBLINK = '\033[25m'
    RESETINVERSE = '\033[27m'
    RESETHIDDEN = '\033[28m'
    RESETSTRIKEOUT = '\033[29m'
    RESETSTRIKETHROUGH = '\033[29m'


class TERMINAL_STYLE_COLOR_CODE:

    BLACK = '\033[30m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'
    LIGHTGRAY = '\033[37m'

    GRAY = '\033[90m'
    LIGHTRED = '\033[91m'
    LIGHTGREEN = '\033[92m'
    LIGHTYELLOW = '\033[93m'
    LIGHTBLUE = '\033[94m'
    LIGHTMAGENTA = '\033[95m'
    LIGHTCYAN = '\033[96m'
    WHITE = '\033[97m'

    RESETCOLOR = '\033[39m'


class TERMINAL_STYLE_BACKGROUND_CODE:

    BACKGROUNDBLACK = '\033[40m'
    BACKGROUNDRED = '\033[41m'
    BACKGROUNDGREEN = '\033[42m'
    BACKGROUNDYELLOW = '\033[43m'
    BACKGROUNDBLUE = '\033[44m'
    BACKGROUNDMAGENTA = '\033[45m'
    BACKGROUNDCYAN = '\033[46m'
    BACKGROUNDLIGHTGRAY = '\033[47m'

    BACKGROUNDGRAY = '\033[100m'
    BACKGROUNDLIGHTRED = '\033[101m'
    BACKGROUNDLIGHTGREEN = '\033[102m'
    BACKGROUNDLIGHTYELLO = '\033[103m'
    BACKGROUNDLIGHTBLUE = '\033[104m'
    BACKGROUNDLIGHTMAGENTA = '\033[105m'
    BACKGROUNDLIGHTCYAN = '\033[106m'
    BACKGROUNDWHITE = '\033[107m'

    RESETBACKGROUND = '\033[39m'


class TERMINAL_STYLE_CODE(TERMINAL_STYLE_CODE,
                          TERMINAL_STYLE_COLOR_CODE,
                          TERMINAL_STYLE_BACKGROUND_CODE):

    @classmethod
    def get(self, name):
        name = name.upper()
        if name.startswith('BGLT'):
            name = 'BACKGROUNDLIGHT' + name[4:]
        if name.startswith('BG'):
            name = 'BACKGROUND' + name[2:]
        if name.startswith('LT'):
            name = 'LIGHT' + name[2:]
        return getattr(self, name)


def tsencode(string, styles=[]):
    if isinstance(styles, str):
        styles = [styles]
    tail = TERMINAL_STYLE_CODE.get('reset')
    for style in styles:
        head = TERMINAL_STYLE_CODE.get(style)
        if string.endswith(tail):
            string = head + string
        else:
            string = string.join([head, tail])
    return string


def __test__():
    string = 'test string'
    print(tsencode(string, 'red'))
    print(tsencode(string, ['red']))
    print(tsencode(string, ['blue', 'bold']))
    print(tsencode(string, ['bgltred', 'gray', 'underline', 'strikeout', 'bold']))


if __name__ == '__main__':
    __test__()
