---
Title: SublimeText 맞춤법 검사기 활용하기
Date: 2019-08-22 00:00
Tags: Development, SublimeText
---

SublimeText에서 맞춤법 검사기를 활용하는 방법이다. SublimeText는 기본 기능으로 맞춤법 검사를 지원하며 hunspell을 사용한다. 사용자 환경설정 파일 `Preference.sublime-settings`에 `spell_check`와 `dictionary` 항목이 있으며, 다음과 같이 이를 수정하여 기능 활성화와 언어 선택이 가능하다. 해당 항목이 없다면 추가하면 된다.

```json
"spell_check": true,
"dictionary": "Packages/Language - English/en_US.dic"
```

미국 영어와 영국 영어 사전이 기본 내장되어 있으며, 한글을 추가하고 싶다면 다음의 링크에서 한국어 사전을 내려받자. `*.dic`와 `*.aff` 파일만 있으면 된다. 참고로 아래가 유일한 hunspell 한국어 사전 공개 프로젝트이므로 다른 선택지는 없다.

[https://github.com/spellcheck-ko/hunspell-dict-ko](https://github.com/spellcheck-ko/hunspell-dict-ko)

그 다음 사용자가 원하는 경로에 사전을 저장하고 다음과 같이 `dictionary` 항목에 경로를 지정해주면 된다.

```json
"dictionary": "Packages/User/Dictionaries/ko.dic"
```

일반적으로 코드 작성 시에는 맞춤법 검사기의 사용 빈도가 많지 않고, 주석 작업 등에 선택적으로 사용되어 질 것이다. 반면, 마크다운 문서를 작성할 때는 항상 문법 검사기를 사용 할 것이다. 이럴 때에는 마크다운 확장자가 정의 되어 있는 설정 파일에 `spell_check`와 `dictionary` 추가하여 사용하면 된다. MarkdownEditing 플러그인을 사용하는 필자의 경우, 사용자 환경설정이 있는 경로의 `Markdown.sublime-settings` 파일에 다음의 항목을 추가하였다. `Preference.sublime-settings`의 설정이 꺼져 있더라도 마크다운과 텍스트 파일에서는 항상 한글 맞춤법 검사를 하게 된다.

```json
"extensions": ["md", "mdown", "txt"],
"spell_check": true,
"dictionary": "Packages/User/Dictionaries/ko.dic",
```

다음으로 검사기를 쉽게 toggle하고 언어를 선택할 수 있는 방법을 설명한다. 코드 작성 시 맞춤법 검사기를 사용하게 되면 자연어와 다른 철자의 예약어, 축약된 변수명 등에서 많은 오류를 보게 될 것이다. 검사기를 간편하게 toggle하고 싶은 욕구가 생길 것이다. 다음과 같이 SublimeText의 사용자 환경설정 경로에 파일을 만들어 명령어를 등록하면 된다. 파일을 생성하면 명령어가 자동으로 등록되며, 명령어 팔레트에 `Spell Check`라고 검색하면 해당 항목이 나타난다. `Current View`가 있는 항목을 통해서 현재 열려 있는 창에만 설정을 적용할 수 있다. `Current View`가 없는 항목은 전체 설정으로 `Preferences.sublime-settings`에 반영된다.

`SpellCheck.sublime-commands`

```json
[
    {
        "caption": "Spell Check: Toggle",
        "command": "dic_toggle"
    },
    {
        "caption": "Spell Check: Toggle (Current View)",
        "command": "dic_toggle_view"
    },
    {
        "caption": "Spell Check: Set Language",
        "command": "dic_set_language"
    },
    {
        "caption": "Spell Check: Set Language (Current View)",
        "command": "dic_set_view_language"
    }
]
```

`SpellCheck.py`

```python
import sublime
import sublime_plugin

import fnmatch
import os.path


def find_resources(pattern):
    resources = []
    if hasattr(sublime, 'find_resources'):
        resources = sublime.find_resources(pattern)
    else:
        for root, dir_names, file_names in os.walk(sublime.packages_path()):
            if ".git" in root:
                continue
            for file_name in file_names:
                rel_path = os.path.relpath(os.path.join(root, file_name), sublime.packages_path())
                if fnmatch.fnmatch(rel_path.lower(), "*" + pattern.lower()):
                    resources += [os.path.join('Packages', rel_path).replace(os.sep, "/")]
    return resources


class DicSetViewLanguageCommand(sublime_plugin.TextCommand):

    def run(self, edit):
        items = find_resources("*.dic")

        def on_done(i):
            if i >= 0:
                settings = self.view.settings()
                settings.set("dictionary", items[i])

        self.view.window().show_quick_panel(items, on_done)


class DicSetLanguageCommand(sublime_plugin.WindowCommand):

    def run(self):
        items = find_resources("*.dic")

        def on_done(i):
            if i >= 0:
                settings = sublime.load_settings("Preferences.sublime-settings")
                settings.set("dictionary", items[i])
                sublime.save_settings("Preferences.sublime-settings")

        self.window.show_quick_panel(items, on_done)


class DicToggleViewCommand(sublime_plugin.TextCommand):

    def run(self, edit):
        settings = self.view.settings()
        value = bool(settings.get("spell_check"))
        settings.set("spell_check", not value)


class DicToggleCommand(sublime_plugin.WindowCommand):

    def run(self):
        settings = sublime.load_settings("Preferences.sublime-settings")
        value = bool(settings.get("spell_check"))
        settings.set("spell_check", not value)
        sublime.save_settings("Preferences.sublime-settings")
```

처음 사용 해보면 조금 부족함을 느낄 수 있다. 특히, 외래어나 전문 용어가 사정에 많이 포함 되어 있지 않아 더욱 그럴 것이다. 그래도 상용 검사기에 근접하는 성능으로, 사용자 사전을 정리하는 수고를 조금만 더하면 꽤 유용하게 쓸 수 있는 편이다. 오류가 표시된 단어에서 마우스 오른쪽 버튼을 눌러 Context 메뉴를 보면 `Add`와 `Ignore` 항목이 있으며, 이를 통해 곧바로 사용자 사전에 단어를 등록 할 수 있다. 등록된 단어는 `Preference.sublime-settings`의 `added_words`와 `ignored_words` 항목에서 확인 및 관리 할 수 있으니 참고하자.

애석하게도 SublimeText에서는 영어와 한국어 사전을 동시에 사용하지 못한다. hunspell 자체는 여러 개의 사전을 동시에 사용할 수 있도록 구현되어 있지만, SublimeText에서는 그렇게까지 사용할 수 있도록 구현되어 있지 않았다. 대안으로 영어와 한글 사전을 병합하는 방법이 있을 수 있겠다. 다음의 링크에서 병합 도구를 내려받을 수 있다. 그런데 다시 한번 더 애석하게도 병합이 잘 되지 않는다. 단, 영어, 라틴어 등 유사한 언어 체계를 가진 사전들 사이의 병합은 잘 되는 것 같다. 다음 버전의 SublimeText에는 이 문제가 해결되어 있기를 바란다.

[https://github.com/arty-name/hunspell-merge/tree/master/dist](https://github.com/arty-name/hunspell-merge/tree/master/dist)
