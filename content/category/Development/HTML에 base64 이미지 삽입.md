---
Title: HTML에 base64 이미지 삽입
Date: 2019-08-22 00:00
Tags: Development, HTML, Python
---


HTML 소스코드에 base64 인코딩된 이미지를 삽입하는 방법이다.

* HTML 소스에 삽입된 이미지는 클라이언트 캐시가 되지 않기 때문에, 아주 용량이 작은 아이콘 정도에 사용하는 것을 추천한다.
* 또한, AWS 요금제 등의 상황에 따라, 단일 트래픽 용량 보다는 쿼리 횟수의 증가를 줄이는 것이 이로울 때 사용하는 것도 고려해 볼 수 있다.
* 다음과 같은 형태로 이미지 파일을 base64인코딩하여 HTML에 삽입 할 수 있다.

```html
<img src="data:image/[extension];base64,[base64 encoded data]">
```

* 다음은 python에서 태그를 생성하는 예제이다.

```python
import base64
import os


def base64img(path):
    ext = os.path.splitext(path)[-1][1:]
    with open(path, 'rb') as file:
        encoded = base64.b64encode(file.read()).decode('utf-8')
    return '<img src="data:image/{};base64,{}">'.format(ext, encoded)
```
