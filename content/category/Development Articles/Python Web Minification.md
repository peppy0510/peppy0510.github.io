---
Title: Python Web Minification
Date: 2019-08-22 00:00
---


Python으로 웹 콘텐츠를 minification 하는 방법을 소개합니다. HTML, JavaScript, CSS 등의 소스 파일에서 불필요한 공백 문자나 주석을 제거하여 네트워크 전송량을 줄이는 방법입니다. 우선 예제에 필요한 라이브러리를 모두 설치합니다.

```bash
pip install jsmin htmlmin beautifulsoup4
```

######

##### JavaScript or CSS Minification

jsmin 라이브러리를 사용하여 minification 합니다.

```python
from jsmin import jsmin

content = 'javascript or css content'

content = jsmin(content)
```

단, CSS minification에는 htmlmin 라이브러리를 사용하는 것이 좋을 수도 있습니다.. 파일을 읽어 처리해야 한다면 다음과 같이 하면 됩니다.

```python
from jsmin import jsmin

path = 'path.js or path.css'

with open(path, 'rb') as file:
    content = file.read().decode('utf-8')
    content = jsmin(content)

with open(path, 'wb') as file:
    file.write(content.encode('utf-8'))
```

참고로 바이너리 모드로 파일을 읽은 후 utf-8 인코딩을 하지 않으면, 한글과 특수문자 등의 오류가 발생할 수 있으므로 주의해야 합니다.

######

##### HTML Minification

htmlmin 라이브러리를 사용하여 minification 합니다.

```python
import htmlmin

content = 'html content'

content = htmlmin.minify(content, remove_empty_space=True)
```

HTML 소스 내에 존재하는 script나 style은 htmlmin으로 처리되지 않습니다. BeautifulSoup을 사용하여 style과 script 태그의 내용을 찾아 별도로 처리하면 됩니다.

```python
from jsmin import jsmin
from bs4 import BeautifulSoup


content = 'html content'

soup = BeautifulSoup(content, 'html.parser')

for v in soup.find_all('style'):
    v.string = jsmin(v.get_text())

for v in soup.find_all('script'):
    v.string = jsmin(v.get_text())

content = str(soup)
```

htmlmin으로 주석은 제거되지 않습니다. 간혹 유명 포털 사이트 브라우징 시 HTML 소스보기 하더라도 많은 주석을 볼 수 있는 경우가 있습니다. 주석에는 개발자가 미처 생각하지 못한 보안 사항, 백도어의 힌트가 포함될 수도 있습니다. 주석을 제거하고 싶다면 다음과 같이 정규식을 사용할 수 있습니다. 단, HTML 조건문에서 사용되는 `![]` 문자가 들어 있다면 제거되지 않는 정규식이므로 주의합니다.

```python
import re

content = 'html content'

ptrn = r'(<!--)([^!^[^]]*)(-->)'
content = re.sub(ptrn, '', content, flags=re.DOTALL)
```

완벽하지 않은 정규식이며, 추후에 더 나은 방법을 발견하면 수정하도록 하겠습니다. 본문 내용자체에 주석을 설명하기 위해 `<!--`와 `-->`가 표기되어 있다면 의도하지 않게 제거될 수 있으므로 주의해야 합니다.

######

##### 응용하기

서비스를 유지 관리하는 측면에서 반복되는 minification 작업은 성가신 일입니다. 또한, 공백문자 제거로 인하여 예상하지 못한 결과물의 변형이 있을 수 있으므로, 소스 코드 수정 시 수시로 확인하는 과정이 필요하며, 응답 시 매번 minification하기 위해서는 응답속도가 증가하는 문제가 발생합니다. 이러한 문제를 해결하기 위해 minify된 파일을 메모리 데이터베이스에 캐싱하여 사용하는 방법이 있습니다. 즉, 파일 수정시간을 참조하여 캐시가 없거나 파일 수정시간 갱신 시에만 minify하여 캐싱하고 이로부터 읽어 응답할 수 있습니다. 이에 더하여 서버 측에서 클라이언트 캐시 응답을 처리하기 위해서는 파일 수정시간 참조가 필수적이므로 이를 함께 처리하도록 구현하면 보다 빠른 응답 속도를 기대할 수 있습니다.
