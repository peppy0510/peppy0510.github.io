---
Title: HTML Template에 Linter 사용 시 발생하는 문제
Date: 2019-08-22 00:00
---


Django, Jinja 등의 HTML Template에 Linter 사용 시 발생하는 문제 해결 방법을 소개한다. Template에 HTML Linter를 사용하게 되면 `{% %}` 태그된 제어문으로 인하여 구조가 흐트러지고 가독성이 떨어지는 경우가 발생한다. `{% %}`를 `{ % % }`로 변환해 버리는 경우도 발생한다. 다음과 같이 제어문을 주석처리 하는 방법으로 간단하게 해결할 수 있다. 단, `{% includes "template.html" %}`와 같이 `includes` 명령어에 주석 처리하면 렌더링 결과가 주석처리 되어 버리기 때문에 주의하자.

```html
<!-- {% for name in names %} -->
<!-- {% if name %} -->
<div>{{ name }}</div>
<!-- {% endif %} -->
<!-- {% endfor %} -->
```
