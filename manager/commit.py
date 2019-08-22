# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


import glob
import htmlmin
import os
import re
import scss
import shutil
import subprocess
import sys
import time

from .terminal import tsencode
from bs4 import BeautifulSoup
from jsmin import jsmin
from multiprocessing.pool import ThreadPool
from pelican import Pelican
from pelican.settings import read_settings


def commit_source():
    commit_manager.commit_source()


def commit_output():
    commit_manager.commit_output()


class CommitManager():

    def __init__(self):
        cwd = os.getcwd()
        self.source_path = cwd
        self.output_path = os.path.join(cwd, 'output')
        self.repository = 'git@github.com:peppy0510/peppy0510.github.io.git'

    def commit_source(self):
        os.chdir(self.source_path)
        print(tsencode('-' * 80, 'gray'))
        print(tsencode(os.getcwd() + '#', 'ltblue'))
        sys.stdout.flush()
        if not os.path.exists(os.path.join(self.output_path, '.git')):
            self.commands('''
            git init
            git add .
            git commit -m "initial commit"
            git branch -m master source
            git remote add origin {}
            git push origin source
            '''.format(self.repository))
        else:
            self.commands('''
            git pull
            git add -A
            git commit -m "update"
            git push origin source
            ''')
        print(tsencode('-' * 80, 'gray'))

    def commit_output(self):
        os.chdir(self.output_path)
        print(tsencode('-' * 80, 'gray'))
        print(tsencode(os.getcwd() + '#', 'ltblue'))
        sys.stdout.flush()

        if not os.path.exists(os.path.join(self.output_path, '.git')):
            self.commands('''
            git init
            git add .
            git commit -m "initial commit"
            git remote add origin {}
            git push origin master --force
            '''.format(self.repository))
        else:
            self.commands('''
            git pull
            git add -A
            git commit -m "update"
            git push origin master
            ''')

        print(tsencode('-' * 80, 'gray'))

    def commands(self, commands):
        if isinstance(commands, str):
            commands = [v.strip(' \n') for v in commands.split('\n')]
            commands = [v for v in commands if v]
        cwd = os.getcwd()
        for command in commands:
            print(tsencode('{}#{}'.format(cwd, command), 'ltblue'))
            sys.stdout.flush()
            self.command(command)

    def command(self, command):
        proc = subprocess.Popen(command, shell=True)
        proc.communicate()


commit_manager = CommitManager()

# ```
# cd output
# git init
# git add .
# git commit -m "first commit"
# git remote add origin git@github.com:peppy0510/peppy0510.github.io.git
# git push origin master --force
# ```

# * 소스코드

# ```
# git init
# git add .
# git commit -m "first commit"
# git branch -m master source
# git remote add origin git@github.com:peppy0510/peppy0510.github.io.git
# git push origin source
# ```

# ### 깃 수정 커밋

# * 결과물

# ```
# cd output
# git add -a
# git commit -m "update"
# git push origin master
# ```

# * 소스코드

# ```
# call pelpub.bat
# git add -a
# git commit -m "update"
# git push origin source
# ```
