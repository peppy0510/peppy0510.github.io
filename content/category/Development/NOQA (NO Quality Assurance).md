---
Title: NOQA (NO Quality Assurance)
Date: 2019-08-24 00:00
Tags: Development, Python
---


Python에서 와일드카드 import를 하거나 exec 명령어를 통해 변수를 선언하는 등의 경우에는 문법 검사기의 경고 메시지를 보게 된다. 문법 검사기의 제안을 따르는 것이 좋겠지만 가끔은 부득이 한 경우가 있다. 다음과 같이 해당 코드 라인의 맨 끝에 # noqa 라는 주석을 추가하는 방법으로 간단하게 해결할 수 있다. 해당 라인만 문법 검사기를 하지 않도록 하는 방법이다.

```python
from manager import *  # noqa
```

참고로 Python에서는 이와 같은 싱글 라인만 무시하는 방법이 존재하며, 멀티라인을 무시하는 방법은 지원하지 않는다. 자세한 내용은 다음의 링크를 참조하자.

* [https://stackoverflow.com/questions/45346575/what-does-noqa-mean-in-python-comments](https://stackoverflow.com/questions/45346575/what-does-noqa-mean-in-python-comments)
* [http://flake8.pycqa.org/en/latest/user/violations.html#in-line-ignoring-errors](http://flake8.pycqa.org/en/latest/user/violations.html#in-line-ignoring-errors)
