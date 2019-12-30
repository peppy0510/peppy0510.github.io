---
Title: Python Django 라우팅 기능 커스터마이즈
Date: 2019-08-24 00:00
---

<!-- Status: hidden -->

Python Django 프로젝트에서 `urls.py`의 라우팅 기능을 커스터마이즈하는 방법을 소개합니다. Monolithic Architecture에서 유용하게 사용할 수 있는 방법입니다. 공식적인 Django 예제에서는 정규식 기반으로 라우팅하는 예제를 주로 다룹니다. 그래서 인지 `urls.py` 내에 라우팅 규칙을 담은 함수나 클래스를 적용할 수 있다는 사실을 잊고 views에서 복잡하게 처리하는 경우를 종종 볼 수 있습니다. 가령 회사 소개 웹 서비스, 제품에 대한 웹 서비스, 모바일 앱 서비스 API 등 각각의 접근 도메인 주소가 다른 경우를 가정합니다. urlpatterns에 url을 등록할 때는 도메인 주소를 제외한 path만 지정할 수 있으나 다음과 같은 방법을 사용하면 도메인 주소를 사용하여 라우팅 할 수 있게 됩니다. `UrlParser` 클래스는 서비스 아키텍처에 따라 간소하게 구현할 수도 있겠습니다.

######

`urls.py`

```python
from django.conf.urls import url
from urlparser import UrlParser


ROOT_DOMAIN_ROUTES = {
    'company-web': ['company-web-domain.com', 'company-web-domain.co.kr'],
    'app-001-web': ['app-001-web-domain.com'],
    'app-001-api': ['app-001-api-domain.com'],
    'app-002-web': ['app-002-web-domain.com'],
    'app-002-api': ['app-002-api-domain.com'],
}


class RootDomainRouter():

    def __call__(self, request):
        url = UrlParser(request.get_host())
        for path, domains in ROOT_DOMAIN_ROUTES.items():
            if url.rootdomain in domains:
                pass


urlpatterns = [
    url(r'^$', RootDomainRouter()),
]
```

######

`urlparser.py`

```python
import re


class UrlParser:

    scheme = None
    subdomain = None
    domain = None
    topdomain = None
    rootdomain = None
    port = None
    path = None
    paths = []
    param = None
    params = {}

    pattern = (r'''^([a-zA-Z]{1,}://){0,1}'''
               r'''([a-zA-Z0-9\.]{1,}[\.]{1}){0,1}'''
               r'''([a-zA-Z0-9\-]{4,})\.'''
               r'''([a-zA-Z0-9]{1,}[\.]{0,1}[a-zA-Z0-9]{0,})'''
               r'''([:]{1,}[0-9]{1,6}){0,1}'''
               r'''(\/[a-zA-Z0-9\_\-\.\/]{1,}){0,1}'''
               r'''(\?[\w\d\W\D\&]{1,}){0,1}''')

    def __init__(self, url):
        self.url = url
        result = re.findall(self.pattern, self.url)

        if not result:
            return

        scheme, subdomain, domain, topdomain, port, path, param = result[0]
        self.scheme = scheme.strip(' :/').lower()
        self.subdomain = subdomain.strip(' .:').lower()
        self.domain = domain.strip(' .:').lower()
        self.topdomain = topdomain.strip(' .:').lower()
        self.port = port.strip(' .:')
        self.rootdomain = '.'.join([self.domain, self.topdomain])
        self.host = ':'.join(['.'.join([self.subdomain, self.rootdomain]), self.port])

        self.path = path
        paths = [v.strip() for v in self.path.split('/')]
        self.paths = [v for v in paths if v]

        self.param = param.strip('?')
        params = [v.strip() for v in self.param.split('&')]

        for v in params:
            keyvalue = v.split('=')
            if len(keyvalue) == 1:
                keyvalue += ['']
            key, value = keyvalue
            self.params.update({key: value})


def __test__(url):
    url = UrlParser(url)
    print(url.scheme)
    print(url.subdomain)
    print(url.rootdomain)
    print(url.host)
    print(url.paths)
    print(url.params)


if __name__ == '__main__':
    url = ('https://sub.root.co.kr:8080/admin/name/update/'
           '?firstname=Taehong&lastname=Kim&nickname')
    __test__(url)

```