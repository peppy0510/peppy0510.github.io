# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


import sys

import manager


def main():
    if 'build' in sys.argv:
        manager.build.build_content()
    if 'serve' in sys.argv:
        manager.build.build_content()
        manager.serve_livereload()
    if 'commit' in sys.argv:
        manager.build.build_content()
        manager.commit.commit_source()
        manager.commit.commit_output()


if __name__ == '__main__':

    main()
