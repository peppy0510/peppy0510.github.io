# encoding: utf-8


'''
author: Taehong Kim
email: peppy0510@hotmail.com
'''


import os
import subprocess
import sys

from .terminal import tsencode


def commit_source():
    commit_manager.commit_source()


def commit_output():
    commit_manager.commit_output()


class CommitManager():

    def __init__(self):
        self.message = 'update'
        if len(sys.argv) == 3 and sys.argv[-1]:
            self.message = sys.argv[-1]
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
            git pull origin source
            git add -A
            git commit -m "{}"
            git push origin source
            '''.format(self.message))
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
            git pull origin master
            git add -A
            git commit -m "{}"
            git push origin master
            '''.format(self.message))

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
