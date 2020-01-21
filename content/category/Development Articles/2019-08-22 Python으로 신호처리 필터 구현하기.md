---
Title: Python으로 신호처리 필터 구현하기
Date: 2019-08-22 00:00
---


신호처리의 기본이 되는 필터를 Python으로 구현해봤습니다. Matlab 예제로 많이 소개되는 필터 구현체를 참고 하였습니다.

######

##### FIR Filter

```python
from scipy import signal


def fir_filter(data, lowcut, highcut, fs, order=29):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    if low == 0 and high == 1:
        return data
    elif low == 0 and high != 1:
        coeff = signal.firwin(order, highcut / nyq)
    elif low != 0 and high == 1:
        coeff = signal.firwin(order, lowcut / nyq, pass_zero=False)
    elif low != 0 and high != 1:
        coeff = signal.firwin(order, [low, high], pass_zero=False)
    output = signal.lfilter(coeff, 1.0, data)
    return output
```

######

##### Butterworth Filter

```python
from scipy import signal


def butter_filter(data, lowcut, highcut, fs, order=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    if low == 0 and high == 1:
        return data
    elif low == 0 and high != 1:
        b, a = signal.butter(order, highcut / nyq, btype='low')
    elif low != 0 and high == 1:
        b, a = signal.butter(order, lowcut / nyq, btype='high')
    elif low != 0 and high != 1:
        b, a = signal.butter(order, [low, high], btype='band')
    output = signal.filtfilt(b, a, data)
    return output
```

######

##### Type I Chebyshev Filter

```python
from scipy import signal


def cheby1_filter(data, lowcut, highcut, fs, order=5, riple=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    if low == 0 and high == 1:
        return data
    elif low == 0 and high != 1:
        b, a = signal.cheby1(order, riple, highcut / nyq, btype='low')
    elif low != 0 and high == 1:
        b, a = signal.cheby1(order, riple, lowcut / nyq, btype='high')
    elif low != 0 and high != 1:
        b, a = signal.cheby1(order, riple, [low, high], btype='band')
    output = signal.filtfilt(b, a, data)
    return output
```

######

##### Type II Chebyshev Filter

```python
from scipy import signal


def cheby2_filter(data, lowcut, highcut, fs, order=5, riple=5):
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    if low == 0 and high == 1:
        return data
    elif low == 0 and high != 1:
        b, a = signal.cheby2(order, riple, highcut / nyq, btype='low')
    elif low != 0 and high == 1:
        b, a = signal.cheby2(order, riple, lowcut / nyq, btype='high')
    elif low != 0 and high != 1:
        b, a = signal.cheby2(order, riple, [low, high], btype='band')
    output = signal.filtfilt(b, a, data)
    return output
```
