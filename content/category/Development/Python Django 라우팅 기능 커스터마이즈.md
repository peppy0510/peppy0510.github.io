---
Title: Python Django 라우팅 기능 커스터마이즈
Date: 2019-08-24 00:00
Tags: Development
---


Python Django urls.py의 라우팅 기능을 커스터마이즈하는 방법을 소개한다.

* 사실 별것은 아니다.
* 공식적인 Django 예제에서는 정규식 기반으로 라우팅하는 예제를 주로 다룬다.
* 그래서인지 urls.py 내에 라우팅 규칙을 담는 함수나 클래스를 적용할 수 있다는 사실을 흔히 망각하고 잘 활용하지 않게 된다.
* 가령 회사 소개 웹 페이지, 특정 모바일 앱 소개 웹 페이지, 특정 모바일 앱 서비스 API 등 각각의 접근 도메인 주소가 다르며, 각 도메인의 여러 자원을 공유하여 하나의 Django 프로젝트로 서비스해야 한다고 가정해보자.
* urlpatterns에 url을 등록할때는 도메인 주소를 제외한 path만 지정 할 수 있어 난감한 상황이 된다.
* 다음과 같은 방법을 urls.py에 적용하면 도메인 주소를 사용하여 라우팅 할 수 있게 된다.

```python
from django.conf.urls import url
from service.base import UrlParser


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
