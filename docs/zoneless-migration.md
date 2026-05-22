# Angular Zoneless 移行手順書

## 概要

Angular 21 の Experimental Zoneless Change Detection を有効にし、`zone.js` を完全に除去する。  
Zoneless では Zone.js による自動変更検出がなくなるため、全コンポーネントを `OnPush` に設定し、非同期コールバック後に手動で `markForCheck()` を呼ぶ必要がある。

---

## Step 1: `provideZonelessChangeDetection` を有効化

**ファイル:** `src/app/app.providers.ts`

```diff
-import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
+import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

 export const appConfig: ApplicationConfig = {
   providers: [
-    provideZoneChangeDetection({ eventCoalescing: true }),
+    provideZonelessChangeDetection(),
     ...
   ]
 };
```

---

## Step 2: `zone.js` をポリフィルから除去

### `angular.json`

```diff
 "polyfills": [
-  "zone.js"
 ],
```

### `src/polyfills.ts`

ファイルを削除するか、中身を空にする。

```diff
-import 'zone.js';
```

---

## Step 3: 全コンポーネントに `ChangeDetectionStrategy.OnPush` を追加

Zoneless では `Default` 策略のコンポーネントが正常に動作しない。  
以下のコンポーネントに `ChangeDetectionStrategy.OnPush` を追加する。

| ファイル | 対応内容 |
|---------|---------|
| `src/app/app.component.ts` | `OnPush` 追加 |
| `src/app/pages/home/home.component.ts` | `OnPush` 追加 |
| `src/app/pages/sheet-info/sheet-info.component.ts` | `OnPush` 追加 |
| `src/app/pages/sheet-list/sheet-list.component.ts` | `OnPush` 追加 |
| `src/app/pages/song-info/song-info.component.ts` | `OnPush` 追加 |
| `src/app/pages/singer/singer-detail/singer-detail.component.ts` | `OnPush` 追加 |
| `src/app/pages/home/components/member-card/member-card.component.ts` | `OnPush` 追加 |
| `src/app/share/wy-ui/wy-player/wy-player.component.ts` | `OnPush` 追加 |
| `src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts` | `OnPush` 追加 |
| `src/app/share/wy-ui/wy-search/wy-search.component.ts` | `OnPush` 追加 |
| `src/app/share/wy-ui/wy-search/wy-search-panel/wy-search-panel.component.ts` | `OnPush` 追加 |

各コンポーネントへの変更パターン:

```diff
+import { ChangeDetectionStrategy, Component } from '@angular/core';

 @Component({
   selector: 'app-xxx',
   standalone: true,
   templateUrl: './xxx.component.html',
+  changeDetection: ChangeDetectionStrategy.OnPush,
 })
```

---

## Step 4: RxJS 非同期コールバック内の `markForCheck()` 追加

Zone.js がなくなると `timer()` / `interval()` / `fromEvent()` のコールバックはAngularの変更検出をトリガーしない。  
コンポーネントのテンプレートバインドされたプロパティを更新する箇所には `markForCheck()` が必要。

### 4-1. `src/app/app.component.ts`

`interval(100)` のコールバックで `loadPercent` を更新しているが `cdr` がない。

```diff
+import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

 export class AppComponent {
+  private cdr = inject(ChangeDetectorRef);

   // interval コールバック内
   interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
     this.loadPercent = Math.max(95, ++this.loadPercent);
+    this.cdr.markForCheck();
   });
 }
```

### 4-2. `src/app/pages/home/components/member-card/member-card.component.ts`

`timer(1500)` のコールバックで `showTip` を更新しているが `cdr` がない。

```diff
+import { ChangeDetectorRef, inject } from '@angular/core';

 export class MemberCardComponent {
+  private cdr = inject(ChangeDetectorRef);

   // timer コールバック内
   timer(1500).subscribe(() => {
     this.showTip = false;
+    this.cdr.markForCheck();
   });
 }
```

### 4-3. `src/app/share/wy-ui/wy-player/wy-player.component.ts`

`timer(1500)` のコールバックで `controlTooltip` を更新しているが `cdr` がない。

```diff
+import { ChangeDetectorRef, inject } from '@angular/core';

 export class WyPlayerComponent {
+  private cdr = inject(ChangeDetectorRef);

   timer(1500).subscribe(() => {
     this.controlTooltip = { title: '', show: false };
+    this.cdr.markForCheck();
   });
 }
```

### 4-4. `src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts`

歌詞ハンドラー（`WyLyric.handler` Subject）のコールバックで `currentLineNum` を更新しているが `cdr` がない。`timer(80)` も同様。

```diff
+import { ChangeDetectorRef, inject } from '@angular/core';

 export class WyPlayerPanelComponent {
+  private cdr = inject(ChangeDetectorRef);

   // 歌詞ハンドラーのサブスクライブ箇所
   this.lyric.handler.subscribe(({ lineNum }) => {
     ...
     this.currentLineNum = lineNum;
+    this.cdr.markForCheck();
     this.scrollToCurrentLyric();
   });

   // timer コールバック
   timer(80).subscribe(() => {
     this.scrollToCurrentLyric();
+    this.cdr.markForCheck();
   });
 }
```

### 4-5. `src/app/share/wy-ui/wy-search/wy-search.component.ts`

`fromEvent` でインプット値を監視してテンプレートバインドされた状態を更新している場合、`markForCheck()` が必要か確認する。  
検索結果の emit のみであれば親コンポーネント側の対応で足りる。

---

## Step 5: 既存 `markForCheck()` の確認（変更不要）

以下のコンポーネントはすでに `ChangeDetectorRef.markForCheck()` を呼んでいるため追加対応不要。  
`effect()` 内で `markForCheck()` を呼ぶパターンは Zoneless でも動作する。

| ファイル | 状況 |
|---------|------|
| `src/app/share/wy-ui/wy-slider/wy-slider.component.ts` | `fromEvent` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-share/wy-layer-share.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-check-code/wy-check-code.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-check-code/wy-code/wy-code.component.ts` | `fromEvent` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-default/wy-layer-default.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-emailLogin/wy-layer-emailLogin.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-like/wy-layer-like.component.ts` | `timer()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-phoneLogin/wy-layer-phoneLogin.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/share/wy-ui/wy-layer/wy-layer-register/wy-layer-register.component.ts` | `interval()` + `markForCheck()` 済み |
| `src/app/pages/member/center/center.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/pages/member/record-detail/record-detail.component.ts` | `effect()` + `markForCheck()` 済み |
| `src/app/pages/member/components/records/records.component.ts` | `effect()` + `markForCheck()` 済み |

---

## Step 6: `WyLyric` タイマーの確認

`src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric.ts` 内の `timer(delay)` は RxJS タイマーで歌詞行を emit する。  
これ自体は UI を持たないクラスのため変更不要。ただし購読側（Step 4-4）での `markForCheck()` が必須。

---

## Step 7: `wy-scroll.component.ts` の確認

`timer(50)` のコールバックは BetterScroll の `refresh()` を呼ぶのみで、テンプレートバインドを変えない。  
DOM 操作のみなので `markForCheck()` は不要だが、スクロール位置がテンプレートに影響する場合は追加する。

---

## Step 8: 動作確認

```bash
npm run start
```

1. ページ遷移が正常に動作するか
2. 音楽プレイヤーの再生・停止・シークが動作するか
3. 歌詞がスクロールするか
4. ログイン・登録モーダルが正常に開閉するか
5. スライダー（シークバー・音量）のドラッグが動作するか
6. 検索機能が動作するか

---

## 参考

- [Angular Zoneless Change Detection (公式)](https://angular.dev/guide/experimental/zoneless)
- `provideZonelessChangeDetection` は Angular 18 で `Experimental` として導入され、Angular 21 で正式 API に昇格
