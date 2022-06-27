---
Title: Ubuntu Desktop 잠자기 비활성화
Date: 2021-05-01 00:00
---


어쩔 수 없이 Ubuntu Desktop 버전에서 서비스를 운영하게 되는 경우가 있습니다.
이때 Desktop 버전은 잠자기 모드가 기본으로 활성화되어 있으므로 이를 확인하고 비활성화해 주어야 합니다.

######

##### Sleep mode status

```bash
sudo systemctl status sleep.target suspend.target hibernate.target hybrid-sleep.target
```

##### Sleep mode disable

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

##### Sleep mode enable

```bash
sudo systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

######

[How To Disable Suspend And Hibernation In Linux](https://ostechnix.com/linux-tips-disable-suspend-and-hibernation/){:target="_blank"}
