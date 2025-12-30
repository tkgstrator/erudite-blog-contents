---
title: Jellyfinで日本語が中華フォントになる件 
date: 2025-12-30
description: デフォルトだと何故か中国語のフォントになります
tags: [Jellyfin]
authors: ['tkgstrator']
---

## 背景

Jellyfinで日本語を表示させようとすると、最初に中華フォントの方が`font-family`でヒットしてしまうので、中国語っぽく表示されてレイアウトが崩れます。

それは気持ち悪いので、直しましょうという話。

### 対策

管理者が**Dashboard > Branding**からCustome CSS codeを追加して、最初に日本語フォントが読み込まれるようにします。

```css
html {
  font-family: Noto Sans, Noto Sans JP;
}
```

再起動とかしなくても、多分反映されます。

## まとめ

Jellyfinってアニメも映画も音楽も視聴できるのでやっぱ神だなって。

