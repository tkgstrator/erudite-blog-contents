---
title: LiteLLMでLLMを集約する 
date: 2026-05-13
description: Claude CodeだったりCodexだったりいろいろCLIを使い分けるのがめんどくさいですよね 
tags: [Claude, Codex]
authors: ['tkgstrator']
---

## LiteLLM

https://www.litellm.ai/

LiteLLMは、まあよくわかってないのですが多分いろんなサービスのLLMをまとめて使えるようにするためのラッパー的な何かです。

各種サービスによってOpenAI形式だったり、それとは微妙に違ったりするので、CLIに通そうとするとひと手間必要なのですが、それを全部いい感じにやってくれます。

### 背景

今月もガッツリClaude Codeを使っているとあっという間に一週間のレートリミットに到達しました。

この記事を執筆している段階であと二日もあるのにレートリミットは99%なので、もうほぼ何も使えません。

で、困ってしまったのですが、Claude Codeには適切な設定をすることで外部サービスをClaude Codeを経由して操作することができるようになります。

それを提供する仕組みの一つがLiteLLMで、これを使うことでChatGPTやGeminiをClaude Code上から利用できるようになります。