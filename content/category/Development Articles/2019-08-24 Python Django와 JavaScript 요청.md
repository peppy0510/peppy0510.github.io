---
Title: Python Django와 JavaScript 요청
Date: 2019-08-24 00:00
Status: draft
---


Python Django에서 JavaScript POST 요청을 유연하게 대응하기 위해 사용하는 방법을 설명한다. Django에서 Ajax와 Angular의 POST 요청을 각각 다르게 구분하여 대응해야 하는 경우가 발생한다. Angular 요청 시 Django에서는 POST 데이터가 `request.POST`에 담겨 있지 않고 `request.body`에 담겨 있는 경우가 있다. 이러한 증상이 특정 Angular 버전의 버그인지 혹은 Django의 버그인지는 확인하지 못했다. Angular 요청의 헤더 기본 정의가 표준적이지 않고 Django 자체에서도 POST를 유연하게 판별하지 못해내는 문제인 것 같았다. 다양한 클라이언트에서 접근하는 API를 개발하다 보니 유연하게 동작하도록 구현해야 할 필요성을 가지게 되었다. 추가로 클라이언트에서 요청 시 편리함을 위하여, 새로이 요청 데이터 변수를 생성하지 않고, 여러 변수가 포함된 Object를 그대로 JSON 인코딩하여 서버로 요청하기도 한다. 이때 불필요한 해시 키가 포함된다. 사실 그대로 두어도 상관은 없으나, 개인적으로는 불필요한 JavaScript 해시 키를 깔끔하게 제거하여 처리부로 넘겨주고 싶었다. 다음과 같이 전처리한 후 데이터를 사용하면 된다.

```python
import json


def remove_javascript_hashkey(data, keyword='$$hashKey'):
    if isinstance(data, list):
        [v.pop(keyword) for v in data if isinstance(v, dict) and '$$hashKey' in v]
    elif isinstance(data, dict):
        [remove_javascript_hashkey(data[key]) for key in data.keys()]


class ViewsBase():

    def __call__(self, request, *args, **kwargs):

        if request.method == 'POST':
            # ajax http request
            if 'json' in request.POST and len(request.POST) > 0:
                data = json.loads(request.POST['json'])
            # angular http request
            elif len(request.FILES) == 0 and len(request.body) > 0:
                data = json.loads(request.body.decode(encoding='utf-8'))
                data = json.loads(data['json']) if len(data) > 0 else {}
            # 자바스크립트 해시 키 제거
            remove_javascript_hashkey(data)
```
