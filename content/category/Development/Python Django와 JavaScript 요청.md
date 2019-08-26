---
Title: Python Django와 JavaScript 요청
Date: 2019-08-24 00:00
Tags: Development
---


Python Django에서 JavaScript POST 요청을 유니버셜하게 대응하기 위해 사용하는 방법을 설명한다.

* Ajax와 Angular의 POST요청을 Django에서 각각 다르게 구분하여 대응해야 함을 발견 하였다.
* Angular 요청 시 Django에서 POST 데이터가 `request.POST`에 담겨 있지 않고 `request.body`에 담겨 있음을 발견 하였다.
* 이러한 증상이 특정 Angular 버전의 버그인지 혹은 Django의 버그인지는 확인하지 못했다. 그러나 어떠한 이유에서라도 유니버셜하게 동작하도록 구현하고 싶었다.
* 덤으로 클라이언트 측의 편리함을 위하여 JavaScript 오브젝트 인스턴스를 통채로 Json 인코딩하여 서버로 요청 시, 불필요한 해시키가 포함된다.
* 불필요한 JavaScript 해시키를 깔끔하게 제거하여 처리부로 넘겨주고 싶었다.
* 다음과 같이 전처리한 후 데이터를 사용하면 된다.

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
            # 자바스크립트 해시키 제거
            remove_javascript_hashkey(data)
```
