---
Title: Python sys.stdout.flush()
Date: 2019-08-24 00:00
status: draft
---


Python에서 `print()` 명령어가 터미널에 곧바로 출력되지 않을 때의 간단한 해결 방법입니다. `print()` 명령어가 터미널에 곧바로 출력되지 않고 프로세스가 종료될 때 한꺼번에 모아서 출력되는 경우가 종종 있습니다. 심지어 `print()` 명령어가 출력되지 않는 경우도 있습니다. `subprocess` 명령어 사용 시에도 동일 문제가 발생할 수 있습니다. 사용하는 터미널 프로그램의 동작 특성 혹은 멀티프로세스를 사용하는 등의 경우 종종 발생하는 문제입니다. 아래와 같이 `print()` 다음에 `sys.stdout.flush()`를 명령하여 간단하게 해결할 수 있습니다. `stdout`에 쌓여 있는 버퍼를 강제로 뱉어내어 터미널에 출력되도록 한다고 생각하면 됩니다.

```python
import sys

print('result')
sys.stdout.flush()
```
