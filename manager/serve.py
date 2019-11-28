# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


import sys

import asyncio

from . import build
from livereload import Server
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def serve_livereload(port=8000, delay=1):
    server = Server()
    server.watch('content', build.build_content, delay=delay)
    server.serve(root='output', port=port, host='localhost')
