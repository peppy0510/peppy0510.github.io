# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


from __future__ import unicode_literals


AUTHOR = 'Taehong Kim'
SITENAME = 'MUTEKLAB'
SITEURL = 'http://muteklab.com'
DEFAULT_DATE_FORMAT = r'%Y-%m-%d'
PATH = 'content'
THEME = 'content'
STATIC_PATHS = ['static']
TIMEZONE = 'Asia/Seoul'
DEFAULT_LANG = 'en'
DEFAULT_PAGINATION = 10

PLUGIN_PATHS = ['plugins']
PLUGINS = [
    'sitemap',
    'neighbors',
    'assets'
]

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

USE_FOLDER_AS_CATEGORY = True
DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = True
DELETE_OUTPUT_DIRECTORY = False
ARTICLE_PATHS = ['category']
# ARTICLE_SAVE_AS = '{date:%Y}/{slug}.html'
# ARTICLE_URL = '{date:%Y}/{slug}.html'
# categories = ['Review', 'Information']

PORT = 8000

CACHE_CONTENT = False
LOAD_CONTENT_CACHE = False
DEFAULT_METADATA = {
    'status': 'published',
    # 'status': 'draft',
    # 'status': 'hidden',
}
