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
import sys
import time

from .terminal import tsencode
from bs4 import BeautifulSoup
from jsmin import jsmin
from multiprocessing.pool import ThreadPool
from pelican import Pelican
from pelican.settings import read_settings


p = Pelican(read_settings('pelicanconf.py'))


def build_content(output='output', minify=True):

    # minify = 'nomin' not in sys.argv[1:]

    tic = time.time()

    try:
        build_manager.delete_output()
        p.run()
        build_manager.delete_output_theme()
        build_manager.make_cname()
        build_manager.make_gitignore()
        # build_manager.render_mediatags()
        build_manager.render_stylesheets()
        if minify:
            build_manager.minify_stylesheets()
            build_manager.minify_javascripts()
            build_manager.minify_templates()
        build_manager.lf2crlfs()
    except SystemExit:
        pass

    print(tsencode('OUTPUT BUILD ELAPSED: {:3.3f}'.format(time.time() - tic), 'ltblue'))
    sys.stdout.flush()


class BuildManager():

    def __init__(self, output='output'):
        self.output = output

    def delete_output(self):
        if not os.path.exists(self.output):
            return
        for name in os.listdir(self.output):
            if name == '.git':
                continue
            path = os.path.join(self.output, name)
            if not os.path.exists(path):
                continue
            if os.path.isdir(path):
                shutil.rmtree(os.path.join(self.output, name))
            else:
                os.remove(path)

    def make_cname(self, cname='muteklab.com'):
        with open(os.path.join(self.output, 'CNAME'), 'w') as file:
            file.write(cname)

    def make_gitignore(self):
        src = os.path.join(os.path.dirname(self.output), '.gitignore')
        dst = os.path.join(os.path.join(self.output, '.gitignore'))
        if os.path.exists(src):
            shutil.copyfile(src, dst)

    def delete_output_theme(self):
        path = os.path.join(self.output, 'theme')
        if os.path.exists(path) and os.path.isdir(path):
            shutil.rmtree(path)

    def minify_javascripts(self):
        self.minify_handler(self.minify_javascript, extensions=('js',))

    def minify_javascript(self, content):
        try:
            content = jsmin(content)
        except Exception:
            pass
        return content

    def minify_templates(self):
        self.minify_handler(self.minify_template, extensions=('html', 'htm',))

    def minify_template(self, content):
        if '<style' not in content and '<script' not in content:
            content
        soup = BeautifulSoup(content, 'html.parser')
        for v in soup.find_all('style'):
            try:
                # text = jsmin(v.get_text())
                text = jsmin(v.decode_contents())
            except Exception:
                continue
            v.string = text
        for v in soup.find_all('script'):
            try:
                # text = jsmin(v.get_text())
                text = jsmin(v.decode_contents())
            except Exception:
                continue
            v.string = text
        content = str(soup)
        content = htmlmin.minify(content, remove_empty_space=True)
        # ptrn = r'(<!--.*?-->)'
        ptrn = r'(<!--)([^!^[^]]*)(-->)'
        content = re.sub(ptrn, '', content)
        return content

    def minify_stylesheets(self):
        self.minify_handler(self.minify_stylesheet, extensions=('css',))

    def minify_stylesheet(self, content):
        try:
            # content = jsmin(content)
            content = htmlmin.minify(content, remove_empty_space=True)
        except Exception:
            pass
        return content

    def render_stylesheets(self, extensions=('sass', 'scss',)):
        paths = self.search_pattern(self.output)
        paths = [v for v in paths if os.path.splitext(v)[-1].strip('.').lower() in extensions]
        for path in paths:
            filename, extension = os.path.splitext(path)
            with open(path, 'rb') as file:
                content = file.read().decode('utf-8')
                try:
                    content = scss.Compiler().compile_string(content)
                except Exception:
                    pass
            path = '.'.join([filename, 'css'])
            with open(path, 'wb') as file:
                file.write(content.encode('utf-8'))

    def search_pattern(self, filepath, pattern=u'*.*'):
        retlist = glob.glob(os.path.join(filepath, pattern))
        findlist = os.listdir(filepath)
        for f in findlist:
            if f.endswith('.git'):
                continue
            next_path = os.path.join(filepath, f)
            if os.path.isdir(next_path):
                retlist += self.search_pattern(next_path, pattern)
            retlist += [next_path]
        return retlist

    def minify_handler(self, handler, extensions=[], thread_number=2):
        tic = time.time()
        paths = self.search_pattern(self.output)
        paths = [v for v in paths if not os.path.splitext(v)[0].endswith('.min')]
        paths = [v for v in paths if os.path.splitext(v)[-1].strip('.').lower() in extensions]

        def single_thread(path):
            with open(path, 'rb') as file:
                content = file.read().decode('utf-8')
                content = handler(content)
            newpath = path
            filename, extension = os.path.splitext(path)
            extension = extension.lower().strip('.')
            if extension in ('js', 'css',) and not filename.lower().endswith('.min'):
                newpath = '.'.join([filename, 'min', extension])
            with open(newpath, 'wb') as file:
                file.write(content.encode('utf-8'))

        if thread_number == 1:
            for path in paths:
                single_thread(path)
        else:
            with ThreadPool(thread_number) as pool:
                pool.map(single_thread, paths)

        print('MINIFY BUILD ELAPSED: {:3.3f} {}'.format(time.time() - tic, extensions))
        sys.stdout.flush()

    def render_mediatags(self):
        tic = time.time()
        extensions = ('html', 'htm',)
        paths = self.search_pattern(self.output)
        paths = [v for v in paths if os.path.splitext(v)[-1].strip('.').lower() in extensions]
        for path in paths:
            with open(path, 'rb') as file:
                content = file.read().decode('utf-8')
                try:
                    content = self.render_mediatag(content)
                except Exception:
                    pass
            if content:
                with open(path, 'wb') as file:
                    file.write(content.encode('utf-8'))
        print(' MEDIA BUILD ELAPSED: {:3.3f} {}'.format(time.time() - tic, extensions))

    def render_mediatag(self, content):
        if '<youtube' not in content:
            return
        soup = BeautifulSoup(content, 'html.parser')
        title_template = '''<h4>{}</h4>'''
        youtube_template = '''
        <div class="fluid-width-video-wrapper">
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/{}?html5=1" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            </div>
        </div>
        '''
        changed = 0
        for v in soup.find_all('youtube'):
            try:
                source = v.get('source')
                source = youtube_template.format(source)
                title = v.get_text().strip()
                if title:
                    title = title_template.format(title)
                    source = title + source
                rendered = BeautifulSoup(source, 'html.parser')
                v.replace_with(rendered)
                changed += 1
            except Exception:
                continue
        if changed == 0:
            return
        content = str(soup)
        return content

    def lf2crlfs(self):
        paths = self.search_pattern(self.output)
        for path in paths:
            self.lf2crlf(path)

    def lf2crlf(self, path):
        _, extension = os.path.splitext(path)
        extension = extension.lower().strip('.')
        if extension not in ('xml', 'js', 'css', 'sass', 'scss', 'svg'):
            return

        if not os.path.exists(path) or os.path.isdir(path):
            return

        with open(path, 'rb') as file:
            content = file.read()

        if b'\0' in content:
            return
        newcontent = re.sub(b'\r?\n', b'\r\n', content)
        if newcontent == content:
            return

        with open(path, 'wb') as file:
            file.write(newcontent)

        # with open('filename.in', 'rU') as infile, open('filename.out', 'w', newline='\n') as outfile:
        #        outfile.writelines(infile.readlines())


build_manager = BuildManager()

# def clone_node_modules(output='output'):
#     src = os.path.join('theme', 'node_modules')
#     dst = os.path.join(output, 'node_modules')
#     if os.path.exists(dst):
#         shutil.rmtree(dst)
#     shutil.copytree(src, dst)
