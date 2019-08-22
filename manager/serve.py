# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


from . import build

from livereload import Server


def serve_livereload(port=8000, delay=1):
    server = Server()
    server.watch('content', build.build_content, delay=delay)
    server.serve(root='output', port=port, host='localhost')
