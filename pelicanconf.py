# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


from __future__ import unicode_literals


AUTHOR = 'Taehong Kim'
SITENAME = 'muteklab.com'
SITEURL = 'http://muteklab.com'

DEFAULT_DATE_FORMAT = '%Y-%m-%d'

PATH = 'content'
THEME = 'content'
# THEME = 'templates'
# THEME = 'content'
STATIC_PATHS = ['static']

TIMEZONE = 'Asia/Seoul'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),
          ('Facebook', 'https://www.facebook.com/tkmix'),
          ('envelope', 'mailto:peppy0510@hotmail.com'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

# COLOR_SCHEME_CSS = 'monokai.css'
# CSS_OVERRIDE = [
#     'static/css/common-style.css'
# ]
# JS_OVERRIDE = ['']


PLUGIN_PATHS = ['plugins']
# ARTICLE_EXCLUDES = []
# PAGE_EXCLUDES = []
# PLUGIN_PATHS = ["plugins", "/content/plugins"]

PLUGINS = [
    'sitemap',
    'neighbors',
    'assets'
]

# Sitemap
SITEMAP = {
    'format': 'xml',
    'priorities': {
        'information': 0.5,
        'review': 0.5,
    },
    'changefreqs': {
        'information': 'monthly',
        'review': 'daily',
    }
}

GITHUB_URL = 'http://github.com/peppy0510'
TWITTER_URL = 'http://twitter.com/tkmix'
FACEBOOK_URL = 'http://facebook.com/tkmix'


AUTHORS_BIO = {
    "peppy0510": {
        "name": "Taehong Kim",
        "cover": "https://arulrajnet.github.io/attila-demo/assets/images/avatar.png",
        "image": "https://avatars1.githubusercontent.com/u/21299773?s=460&v=4",
        "website": "http://blog.arulraj.net",
        "location": "Chennai",
        "bio": "This is the place for a small biography with max 200 characters. Well, now 100 are left. Cool, hugh?"
    }
}


# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
# OUTPUT_SOURCES =
# OUTPUT_SOURCES_EXTENSION = '.md'
USE_FOLDER_AS_CATEGORY = True
# DEFAULT_CATEGORY = 'Review'
DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = True
DELETE_OUTPUT_DIRECTORY = False

# categories = ['Review', 'Information']
PORT = 8000

ARTICLE_PATHS = ['category']

# ARTICLE_SAVE_AS = '{date:%Y}/{slug}.html'
# ARTICLE_URL = '{date:%Y}/{slug}.html'

CACHE_CONTENT = False
LOAD_CONTENT_CACHE = False

DISQUS_SITENAME = 'muteklab'

DEFAULT_METADATA = {
    'status': 'published',
    # 'status': 'draft',
    # 'status': 'hidden',
}
