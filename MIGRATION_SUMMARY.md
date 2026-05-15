# Standalone Components 移行作業サマリー

**実施日:** 2026-05-15  
**現在の状態:** 部分完了（Phase 1 + Phase 3 の一部）  
**ビルド状態:** ✅ 成功

---

## 完了した作業

### Phase 1: サービス層の統一とプロバイダー準備 ✅

#### 作成したファイル
- ✅ `src/app/services/tokens.ts` - API_CONFIG と WINDOW トークンの定義
- ✅ `src/app/app.providers.ts` - ApplicationConfig（全プロバイダーの集約）
- ✅ `src/app/app.routes.ts` - Standalone ルーティング定義

#### 変更したファイル（12ファイル）
1. ✅ `src/app/services/home.service.ts` - `providedIn: 'root'` に変更
2. ✅ `src/app/services/member.service.ts` - `providedIn: 'root'` に変更
3. ✅ `src/app/services/sheet.service.ts` - `providedIn: 'root'` に変更
4. ✅ `src/app/services/singer.service.ts` - `providedIn: 'root'` に変更
5. ✅ `src/app/services/song.service.ts` - `providedIn: 'root'` に変更
6. ✅ `src/app/services/search.service.ts` - `providedIn: 'root'` に変更
7. ✅ `src/app/services/http-interceptors/common.interceptor.ts` - Functional interceptor に変換
8. ✅ `src/app/services/http-interceptors/index.ts` - 空配列に変更（互換性維持）

全サービスが `ServicesModule` から独立し、`providedIn: 'root'` で提供されるようになりました。

---

### Phase 3: 共有コンポーネントの Standalone 化（一部完了）✅

#### 3.1 Pipes の Standalone 化（2ファイル）✅
- ✅ `src/app/share/pipes/format-time.pipe.ts`
- ✅ `src/app/share/pipes/play-count.pipe.ts`

#### 3.2 Directives の Standalone 化（2ファイル）✅
- ✅ `src/app/share/directives/clickoutside.directive.ts`
- ✅ `src/app/share/directives/img-default.directive.ts`

#### 3.3 WySlider コンポーネント群の Standalone 化（3ファイル + module）✅
- ✅ `src/app/share/wy-ui/wy-slider/wy-slider.component.ts`
- ✅ `src/app/share/wy-ui/wy-slider/wy-slider-track.component.ts`
- ✅ `src/app/share/wy-ui/wy-slider/wy-slider-handle.component.ts`
- ✅ `src/app/share/wy-ui/wy-slider/wy-slider.module.ts` - imports 方式に更新

**依存関係:**
- `CommonModule` - ngStyle ディレクティブ用
- 子コンポーネント同士の相互インポート

#### 3.4 WyPlayer コンポーネント群の Standalone 化（3ファイル + module）✅
- ✅ `src/app/share/wy-ui/wy-player/wy-player.component.ts`
- ✅ `src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts`
- ✅ `src/app/share/wy-ui/wy-player/wy-scroll/wy-scroll.component.ts`
- ✅ `src/app/share/wy-ui/wy-player/wy-player.module.ts` - imports 方式に更新

**依存関係:**
- `CommonModule`, `FormsModule`
- `NzTooltipModule`, `NzIconModule` (ng-zorro)
- `WySliderComponent` (既に standalone)
- `FormatTimePipe`, `ClickoutsideDirective`, `ImgDefaultDirective` (既に standalone)
- `WyScrollComponent`, `WyPlayerPanelComponent`

#### 3.5 WyUiModule の更新✅
- ✅ `src/app/share/wy-ui/wy-ui.module.ts` - standalone コンポーネントを declarations から imports に移動

---

## 残りの作業

### Phase 3（続き）: 共有コンポーネントの Standalone 化

#### 3.6 WySearch コンポーネント群（2ファイル + module）⏳
- ⏳ `wy-search.component.ts`
- ⏳ `wy-search-panel/wy-search-panel.component.ts`
- ⏳ `wy-search.module.ts`

#### 3.7 WyLayer コンポーネント群（9ファイル + module）⏳
- ⏳ `wy-layer-modal/wy-layer-modal.component.ts`
- ⏳ `wy-layer-default/wy-layer-default.component.ts`
- ⏳ `wy-layer-phoneLogin/wy-layer-phoneLogin.component.ts`
- ⏳ `wy-layer-emailLogin/wy-layer-emailLogin.component.ts`
- ⏳ `wy-layer-like/wy-layer-like.component.ts`
- ⏳ `wy-layer-share/wy-layer-share.component.ts`
- ⏳ `wy-layer-register/wy-layer-register.component.ts`
- ⏳ `wy-check-code/wy-check-code.component.ts`
- ⏳ `wy-check-code/wy-code/wy-code.component.ts`
- ⏳ `wy-layer.module.ts`

#### 3.8 SingleSheet コンポーネント（1ファイル）⏳
- ⏳ `single-sheet/single-sheet.component.ts`

#### 3.9 共有エクスポートファイル作成⏳
- ⏳ `src/app/share/index.ts`

---

### Phase 4: ページコンポーネントの Standalone 化

#### 4.1 Home ページ（3ファイル + modules 削除）⏳
- ⏳ `pages/home/home.component.ts`
- ⏳ `pages/home/components/wy-carousel/wy-carousel.component.ts`
- ⏳ `pages/home/components/member-card/member-card.component.ts`
- ⏳ 削除: `home.module.ts`, `home-routing.module.ts`

#### 4.2 SheetList ページ（1ファイル + modules 削除）⏳
- ⏳ `pages/sheet-list/sheet-list.component.ts`
- ⏳ 削除: `sheet-list.module.ts`, `sheet-list-routing.module.ts`

#### 4.3 SheetInfo ページ（1ファイル + modules 削除）⏳
- ⏳ `pages/sheet-info/sheet-info.component.ts`
- ⏳ 削除: `sheet-info.module.ts`, `sheet-info-routing.module.ts`

#### 4.4 Singer ページ（1ファイル + modules 削除）⏳
- ⏳ `pages/singer/singer-detail/singer-detail.component.ts`
- ⏳ 削除: `singer.module.ts`, `singer-routing.module.ts`

#### 4.5 SongInfo ページ（1ファイル + modules 削除）⏳
- ⏳ `pages/song-info/song-info.component.ts`
- ⏳ 削除: `song-info.module.ts`, `song-info-routing.module.ts`

#### 4.6 PagesModule 削除⏳
- ⏳ 削除: `pages/pages.module.ts`

---

### Phase 5: AppComponent と main.ts の変更

#### 5.1 AppState 型定義作成⏳
- ⏳ 新規作成: `src/app/store/state.ts`

#### 5.2 AppComponent の Standalone 化⏳
- ⏳ `src/app/app.component.ts`
- ⏳ `AppStoreModule` → `AppState` に型変更

#### 5.3 main.ts の変更⏳
- ⏳ `src/main.ts` を `bootstrapApplication` に変更

#### 5.4 モジュールファイルの削除⏳
**コアモジュール（4ファイル）:**
- ⏳ `app.module.ts`
- ⏳ `core/core.module.ts`
- ⏳ `services/services.module.ts`
- ⏳ `store/index.ts`
- ⏳ `app-routing.module.ts`

**共有モジュール（6ファイル）:**
- ⏳ `share/share.module.ts`
- ⏳ `share/wy-ui/wy-ui.module.ts`
- ⏳ `share/wy-ui/wy-slider/wy-slider.module.ts`
- ⏳ `share/wy-ui/wy-player/wy-player.module.ts`
- ⏳ `share/wy-ui/wy-search/wy-search.module.ts`
- ⏳ `share/wy-ui/wy-layer/wy-layer.module.ts`

**ページモジュール（12ファイル）:**
- ⏳ `pages/pages.module.ts`
- ⏳ 各ページの `xxx.module.ts` と `xxx-routing.module.ts`（計11ファイル）

---

## 技術的な変更点

### 1. 依存注入の変更

**修正前:**
```typescript
constructor(private service: MyService) {}
```

**修正後:**
```typescript
private service = inject(MyService);
```

### 2. HTTP Interceptor

**修正前（Class-based）:**
```typescript
@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // ...
  }
}
```

**修正後（Functional）:**
```typescript
export const commonInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }))
    .pipe(catchError(handleError));
};
```

### 3. ルーティング

**修正前（loadChildren）:**
```typescript
{
  path: 'home',
  loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
}
```

**修正後（loadComponent）:**
```typescript
{
  path: 'home',
  loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
}
```

### 4. NgModule の段階的移行パターン

Standalone コンポーネントと NgModule を共存させる方法：

```typescript
@NgModule({
  declarations: [],  // standalone は空に
  imports: [
    CommonModule,
    StandaloneComponent  // imports に移動
  ],
  exports: [StandaloneComponent]
})
```

---

## ビルド結果

**現在のビルド状態:**
```
Initial chunk files   | Raw size  | Estimated transfer size
main.js              | 96.42 kB  | 24.14 kB
chunk-UKS2BJ43.js    | 1.18 MB   | 260.30 kB
styles.css           | 640.63 kB | 57.22 kB
polyfills.js         | 34.59 kB  | 11.33 kB

Initial total        | 2.01 MB   | 369.22 kB
```

**警告:**
- ⚠️ Bundle size が budget (2.00 MB) を 12.92 kB 超過
- ⚠️ `query-string` モジュールが CommonJS（最適化阻害）

---

## 次のステップ

1. **`STANDALONE_MIGRATION_GUIDE.md` を参照** して、残りの作業を完了してください。
2. 各 Phase 完了後に `npm run build` でビルドを確認してください。
3. Phase 5 完了後、`npm start` で開発サーバーを起動し、全機能をテストしてください。

---

## 参考資料

- **移行ガイド:** `STANDALONE_MIGRATION_GUIDE.md`
- **Angular 公式:** https://angular.dev/guide/standalone-components
- **計画ドキュメント:** `/home/node/.claude/plans/angular-v8-v21-velvety-volcano.md`

---

## Git 管理推奨

```bash
# 現在の変更を commit
git add .
git commit -m "Phase 1 + Phase 3（一部）完了: サービス層統一、Pipes/Directives/WySlider/WyPlayer を standalone 化"

# 作業ブランチ
git branch  # 現在: feature/standalone
```

---

**作業開始時の状態に戻す場合:**
```bash
git reset --hard e54819c  # または適切なコミットハッシュ
```
