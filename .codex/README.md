# .codex: 仕様書駆動開発セットアップ

このディレクトリは、実装より先に仕様を確定し、合意してから開発を進めるための作業領域です。

## 基本フロー
1. `templates/01-requirements.md` をコピーして要求仕様を作成
2. `templates/02-design.md` で設計を整理
3. `templates/03-implementation-plan.md` で実装計画を分解
4. `templates/04-test-plan.md` で検証観点を定義
5. 仕様レビュー完了後に実装開始

## 推奨ディレクトリ構成
- `specs/<ticket-or-feature>/01-requirements.md`
- `specs/<ticket-or-feature>/02-design.md`
- `specs/<ticket-or-feature>/03-implementation-plan.md`
- `specs/<ticket-or-feature>/04-test-plan.md`
- `specs/<ticket-or-feature>/notes.md` (任意)

## 運用ルール
- 実装PRには対応する `specs/<ticket-or-feature>` を必須で紐付ける
- 仕様変更は実装より先に `requirements/design` を更新する
- 迷ったら「なぜ必要か」「何を受け入れ条件とするか」を先に明文化する
