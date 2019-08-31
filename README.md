
https://muteklab.com

https://peppy0510.github.io

https://github.com/peppy0510/peppy0510.github.io/settings

Pelican 설정

https://spapas.github.io/2013/10/07/pelican-static-windows/

### 깃 최초 커밋

* 결과물

```
cd output
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:peppy0510/peppy0510.github.io.git
git push origin master --force
```

* 소스코드

```
git init
git add .
git commit -m "first commit"
git branch -m master source
git remote add origin git@github.com:peppy0510/peppy0510.github.io.git
git push origin source
```

### 깃 수정 커밋

* 결과물

```
cd output
git add -a
git commit -m "update"
git push origin master
```

* 소스코드

```
call pelpub.bat
git add -a
git commit -m "update"
git push origin source
```

### 깃 클론

```
git clone -b source git@github.com:peppy0510/peppy0510.github.io.git
```
