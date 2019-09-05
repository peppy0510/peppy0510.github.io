---
Title: Python 필터구현
Date: 2019-08-22 00:00
Tags: Development, Python, DSP
Status: hidden
---


Python으로 필터를 구현했다. Matlab 예제로 많이 소개되는 구현체를 참조하였다.


###### FIR Filter

```python
from scipy import signal


def fir_filter(data, lowcut, highcut, fs, order=29):
    # order: Length of the filter
    # (number of coefficients, i.e. the filter order + 1)
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

###### Butterworth Filter

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
    output = signal.filtfilt(b, a, data)  # lfilter(b, a, data)
    return output
```

###### Type I Chebyshev Filter

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
    output = signal.filtfilt(b, a, data)  # lfilter(b, a, data)
    return output
```

###### Type II Chebyshev Filter

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
    output = signal.filtfilt(b, a, data)  # lfilter(b, a, data)
    return output
```
