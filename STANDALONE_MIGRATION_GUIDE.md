# Angular Standalone Components 移行ガイド

このドキュメントは、残りの Standalone Components 移行作業を完了するためのステップバイステップガイドです。

## 現在の進捗状況（2026-05-15）

### ✅ 完了済み

#### Phase 1: サービス層の統一
- ✅ `src/app/services/tokens.ts` 作成（API_CONFIG, WINDOW トークン）
- ✅ 全サービス（6ファイル）を `providedIn: 'root'` に変更
- ✅ HTTP Interceptor を functional 化（`commonInterceptor`）
- ✅ `src/app/app.providers.ts` 作成（ApplicationConfig）
- ✅ `src/app/app.routes.ts` 作成（Routes 定義）

#### Phase 3: 共有コンポーネントの Standalone 化（一部）
- ✅ **Pipes（2ファイル）**
  - `format-time.pipe.ts`
  - `play-count.pipe.ts`
- ✅ **Directives（2ファイル）**
  - `clickoutside.directive.ts`
  - `img-default.directive.ts`
- ✅ **WySlider コンポーネント群（3ファイル）**
  - `wy-slider.component.ts`
  - `wy-slider-track.component.ts`
  - `wy-slider-handle.component.ts`
  - ✅ `wy-slider.module.ts` を imports 方式に変更
- ✅ **WyPlayer コンポーネント群（3ファイル）**
  - `wy-player.component.ts`
  - `wy-player-panel/wy-player-panel.component.ts`
  - `wy-scroll/wy-scroll.component.ts`
  - ✅ `wy-player.module.ts` を imports 方式に変更

**現在のビルド状態:** ✅ **成功** （エラーなし）

---

## 残りの作業

### Phase 3（続き）: 共有コンポーネントの Standalone 化

#### 3.1 WySearch コンポーネント群の Standalone 化

**対象ファイル:**
- `src/app/share/wy-ui/wy-search/wy-search.component.ts`
- `src/app/share/wy-ui/wy-search/wy-search-panel/wy-search-panel.component.ts`

**手順:**

1. **wy-search-panel.component.ts の変更**

```typescript
// 修正前
@Component({ standalone: false,
  selector: 'app-wy-search-panel',
  // ...
})

// 修正後
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wy-search-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  // ...
})
```

2. **wy-search.component.ts の変更**

```typescript
// 修正前
@Component({ standalone: false,
  selector: 'app-wy-search',
  // ...
})

// 修正後
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
  selector: 'app-wy-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    NzIconModule,
    NzInputModule,
    WySearchPanelComponent
  ],
  // ...
})
```

3. **wy-search.module.ts の更新**

```typescript
// 修正前
@NgModule({
  declarations: [WySearchComponent, WySearchPanelComponent],
  imports: [/* ... */],
  exports: [WySearchComponent]
})

// 修正後
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    NzIconModule,
    NzInputModule,
    WySearchComponent,
    WySearchPanelComponent
  ],
  exports: [WySearchComponent]
})
```

---

#### 3.2 WyLayer コンポーネント群の Standalone 化

**対象ファイル（9ファイル）:**
- `wy-layer-modal/wy-layer-modal.component.ts` （親コンポーネント）
- `wy-layer-default/wy-layer-default.component.ts`
- `wy-layer-phoneLogin/wy-layer-phoneLogin.component.ts`
- `wy-layer-emailLogin/wy-layer-emailLogin.component.ts`
- `wy-layer-like/wy-layer-like.component.ts`
- `wy-layer-share/wy-layer-share.component.ts`
- `wy-layer-register/wy-layer-register.component.ts`
- `wy-check-code/wy-check-code.component.ts`
- `wy-check-code/wy-code/wy-code.component.ts`

**戦略:** 子コンポーネントから順に standalone 化し、最後に親（wy-layer-modal）を変更。

**手順（各コンポーネント共通）:**

1. **子コンポーネントの standalone 化**

```typescript
// wy-layer-default.component.ts の例
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
// ... 他の ng-zorro モジュール

@Component({
  selector: 'app-wy-layer-default',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    // template で使用している全ての ng-zorro モジュールを追加
  ],
  templateUrl: './wy-layer-default.component.html',
  styleUrls: ['./wy-layer-default.component.less']
})
```

**ヒント:** テンプレートで使用している ng-zorro コンポーネントを確認し、対応するモジュールを imports に追加してください。

2. **wy-layer-modal.component.ts の変更（最後に実施）**

```typescript
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzButtonModule } from 'ng-zorro-antd/button';

// 全ての子コンポーネントをインポート
import { WyLayerDefaultComponent } from '../wy-layer-default/wy-layer-default.component';
import { WyLayerPhoneLoginComponent } from '../wy-layer-phoneLogin/wy-layer-phoneLogin.component';
import { WyLayerEmailLoginComponent } from '../wy-layer-emailLogin/wy-layer-emailLogin.component';
import { WyLayerLikeComponent } from '../wy-layer-like/wy-layer-like.component';
import { WyLayerShareComponent } from '../wy-layer-share/wy-layer-share.component';
import { WyLayerRegisterComponent } from '../wy-layer-register/wy-layer-register.component';

@Component({
  selector: 'app-wy-layer-modal',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    NzButtonModule,
    WyLayerDefaultComponent,
    WyLayerPhoneLoginComponent,
    WyLayerEmailLoginComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyLayerRegisterComponent
  ],
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less']
})
```

3. **wy-layer.module.ts の更新**

```typescript
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule,
    NzButtonModule,
    // ... 他の ng-zorro モジュール
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    // ... 全ての子コンポーネント
  ],
  exports: [WyLayerModalComponent]
})
```

---

#### 3.3 SingleSheet コンポーネントの Standalone 化

**対象ファイル:**
- `src/app/share/wy-ui/single-sheet/single-sheet.component.ts`

**手順:**

```typescript
// single-sheet.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayCountPipe } from '../../pipes/play-count.pipe';
import { ImgDefaultDirective } from '../../directives/img-default.directive';

@Component({
  selector: 'app-single-sheet',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PlayCountPipe,
    ImgDefaultDirective
  ],
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent {
  // 既存のロジック
}
```

**wy-ui.module.ts の更新:**

```typescript
@NgModule({
  declarations: [],  // SingleSheetComponent を削除
  imports: [
    // ... 既存の imports
    SingleSheetComponent,  // imports に移動
    PlayCountPipe,
    ImgDefaultDirective
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
    WySearchModule,
    WyLayerModule,
    ImgDefaultDirective
  ]
})
```

---

#### 3.4 共有エクスポートファイルの作成

**新規作成:** `src/app/share/index.ts`

```typescript
// Pipes
export { FormatTimePipe } from './pipes/format-time.pipe';
export { PlayCountPipe } from './pipes/play-count.pipe';

// Directives
export { ClickoutsideDirective } from './directives/clickoutside.directive';
export { ImgDefaultDirective } from './directives/img-default.directive';

// Components
export { SingleSheetComponent } from './wy-ui/single-sheet/single-sheet.component';
export { WyPlayerComponent } from './wy-ui/wy-player/wy-player.component';
export { WySearchComponent } from './wy-ui/wy-search/wy-search.component';
export { WyLayerModalComponent } from './wy-ui/wy-layer/wy-layer-modal/wy-layer-modal.component';
export { WySliderComponent } from './wy-ui/wy-slider/wy-slider.component';
```

---

### Phase 4: ページコンポーネントの Standalone 化

#### 4.1 Home ページの Standalone 化

**対象ファイル:**
- `src/app/pages/home/home.component.ts`
- `src/app/pages/home/components/wy-carousel/wy-carousel.component.ts`
- `src/app/pages/home/components/member-card/member-card.component.ts`

**手順:**

1. **子コンポーネント（wy-carousel, member-card）を standalone 化**

```typescript
// wy-carousel.component.ts
import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-wy-carousel',
  standalone: true,
  imports: [CommonModule, NzCarouselModule],
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less']
})
export class WyCarouselComponent {
  // 既存のロジック
}
```

```typescript
// member-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzAvatarModule, NzButtonModule],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent {
  // 既存のロジック
}
```

2. **home.component.ts を standalone 化**

```typescript
import { Component, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select, createFeatureSelector } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// ng-zorro
import { NzCarouselComponent, NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

// Services
import { SheetService } from '../../services/sheet.service';
import { MemberService } from '../../services/member.service';
import { LanguageService } from '../../services/language.service';
import { BatchActionsService } from '../../store/batch-actions.service';

// Components
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { SingleSheetComponent } from '../../share/wy-ui/single-sheet/single-sheet.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzCarouselModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    WyCarouselComponent,
    MemberCardComponent,
    SingleSheetComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sheetService = inject(SheetService);
  private batchActionsService = inject(BatchActionsService);
  private store$ = inject(Store);
  private memberService = inject(MemberService);
  private languageService = inject(LanguageService);
  
  private destroy$ = new Subject<void>();

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  // 既存のプロパティ

  ngOnInit() {
    // constructor の内容を ngOnInit に移動
    this.route.data
      .pipe(
        map((res) => res['homeDatas']),
        takeUntil(this.destroy$)
      )
      .subscribe(([banners, tags, songSheetList, singerList]) => {
        this.banners = banners;
        this.hotTags = tags;
        this.songSheetList = songSheetList;
        this.singerList = singerList;
      });
    
    // 他の subscription ロジック
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 既存のメソッド
}
```

3. **home.module.ts と home-routing.module.ts を削除**

これらのファイルは不要になります。

---

#### 4.2 他のページコンポーネントの Standalone 化

**同じパターンで以下のページを変更:**

- **SheetListComponent** (`src/app/pages/sheet-list/sheet-list.component.ts`)
- **SheetInfoComponent** (`src/app/pages/sheet-info/sheet-info.component.ts`)
- **SingerDetailComponent** (`src/app/pages/singer/singer-detail/singer-detail.component.ts`)
- **SongInfoComponent** (`src/app/pages/song-info/song-info.component.ts`)

**共通パターン:**

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// 必要な ng-zorro モジュールをインポート
// 必要な共有コンポーネントをインポート

@Component({
  selector: 'app-xxx',
  standalone: true,
  imports: [
    CommonModule,
    // テンプレートで使用している全てのモジュール・コンポーネント
  ],
  templateUrl: './xxx.component.html',
  styleUrls: ['./xxx.component.less']
})
export class XxxComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // 他の inject
  
  // 既存のロジック
}
```

**各ページで削除するファイル:**
- `xxx.module.ts`
- `xxx-routing.module.ts`

---

### Phase 5: AppComponent と main.ts の変更

#### 5.1 AppState 型定義の作成

**新規作成:** `src/app/store/state.ts`

```typescript
import { PlayerState } from './reducers/player.reducer';
import { MemberState } from './reducers/member.reducer';

export interface AppState {
  player: PlayerState;
  member: MemberState;
}
```

---

#### 5.2 AppComponent の Standalone 化

**変更:** `src/app/app.component.ts`

```typescript
import { Component, OnDestroy, Inject, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store, select, createFeatureSelector } from '@ngrx/store';

// ng-zorro
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Services
import { SearchService } from './services/search.service';
import { MemberService } from './services/member.service';
import { StorageService } from './services/storage.service';
import { LanguageService } from './services/language.service';
import { BatchActionsService } from './store/batch-actions.service';

// Components
import { WyPlayerComponent } from './share/wy-ui/wy-player/wy-player.component';
import { WySearchComponent } from './share/wy-ui/wy-search/wy-search.component';
import { WyLayerModalComponent } from './share/wy-ui/wy-layer/wy-layer-modal/wy-layer-modal.component';

// Store
import { AppState } from './store/state';
import { SetUserId } from './store/actions/member.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzProgressModule,
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule,
    WyPlayerComponent,
    WySearchComponent,
    WyLayerModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnDestroy {
  private searchService = inject(SearchService);
  private store$ = inject(Store<AppState>);  // ← AppState に変更
  private batchActionsService = inject(BatchActionsService);
  private memberService = inject(MemberService);
  private messageService = inject(NzMessageService);
  private storgeService = inject(StorageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleSerivce = inject(Title);
  private languageService = inject(LanguageService);
  @Inject(DOCUMENT) private doc: Document = inject(DOCUMENT);

  // 既存のプロパティ

  constructor() {
    // 既存の constructor ロジック
    const userId = this.storgeService.getStorage('wyUserID');
    if (userId) {
      this.memberService.getUserDetail(userId).subscribe((user) => {
        this.user = user;
      });
      this.store$.dispatch(SetUserId({ userId }));
    }
    
    // ... 既存のロジック
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 既存のメソッド
}
```

**重要:** `AppStoreModule` 型を使用している箇所を全て `AppState` に置き換えてください。

---

#### 5.3 main.ts の変更

**変更:** `src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.providers';
import { environment } from './environments/environment';

// 日本語ロケール登録（ng-zorro 用）
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';
registerLocaleData(ja);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

---

#### 5.4 モジュールファイルの削除

以下のファイルを削除してください：

**コアモジュール:**
- `src/app/app.module.ts`
- `src/app/core/core.module.ts`
- `src/app/services/services.module.ts` （tokens.ts に移動済み）
- `src/app/store/index.ts` （state.ts に移動済み）
- `src/app/app-routing.module.ts` （app.routes.ts に移行済み）

**共有モジュール:**
- `src/app/share/share.module.ts`
- `src/app/share/wy-ui/wy-ui.module.ts`
- `src/app/share/wy-ui/wy-slider/wy-slider.module.ts`
- `src/app/share/wy-ui/wy-player/wy-player.module.ts`
- `src/app/share/wy-ui/wy-search/wy-search.module.ts`
- `src/app/share/wy-ui/wy-layer/wy-layer.module.ts`

**ページモジュール:**
- `src/app/pages/pages.module.ts`
- `src/app/pages/home/home.module.ts`
- `src/app/pages/home/home-routing.module.ts`
- `src/app/pages/sheet-list/sheet-list.module.ts`
- `src/app/pages/sheet-list/sheet-list-routing.module.ts`
- `src/app/pages/sheet-info/sheet-info.module.ts`
- `src/app/pages/sheet-info/sheet-info-routing.module.ts`
- `src/app/pages/singer/singer.module.ts`
- `src/app/pages/singer/singer-routing.module.ts`
- `src/app/pages/song-info/song-info.module.ts`
- `src/app/pages/song-info/song-info-routing.module.ts`

---

## 検証方法

### 各段階での検証

**Phase 3 完了後:**
```bash
npm run build
```

エラーがないことを確認してください。

**Phase 4 完了後:**
```bash
npm run build
npm start

# ブラウザで http://localhost:4200 にアクセス
# 各ページが正常に表示されることを確認
```

**Phase 5 完了後（最終検証）:**

```bash
# 1. Production ビルド
npm run build -- --configuration production

# 2. Bundle size 確認
ls -lh www/*.js

# 3. 開発サーバー起動
npm start
```

**ブラウザでの確認項目:**
- [ ] アプリ起動
- [ ] 全ページ遷移（Home, SheetList, SheetInfo, Singer, SongInfo）
- [ ] ログイン/ログアウト
- [ ] 曲再生・一時停止
- [ ] 音量調整
- [ ] 検索機能
- [ ] モーダル表示（ログイン、いいね、共有）
- [ ] NgRx DevTools 動作（Redux DevTools 拡張機能で確認）
- [ ] ブラウザリロード（ルーティング維持）
- [ ] Lazy loading（Chrome DevTools Network タブで chunk ファイル確認）

---

## トラブルシューティング

### よくあるエラー

#### 1. `NG6008: Component is standalone, and cannot be declared in an NgModule`

**原因:** standalone コンポーネントを `declarations` に含めている。

**解決策:** `declarations` から削除し、`imports` に移動。

```typescript
// 修正前
@NgModule({
  declarations: [StandaloneComponent],
  imports: [CommonModule]
})

// 修正後
@NgModule({
  declarations: [],
  imports: [CommonModule, StandaloneComponent]
})
```

---

#### 2. `NG6004: Can't be exported from this NgModule, as it must be imported first`

**原因:** standalone コンポーネントを export しているが、imports していない。

**解決策:** exports する前に imports に追加。

```typescript
@NgModule({
  declarations: [],
  imports: [StandaloneComponent],  // ← 追加
  exports: [StandaloneComponent]
})
```

---

#### 3. テンプレートで `Can't bind to 'xxx' since it isn't a known property`

**原因:** テンプレートで使用しているディレクティブ/コンポーネントが imports されていない。

**解決策:** 必要なモジュール/コンポーネントを imports に追加。

```typescript
@Component({
  standalone: true,
  imports: [
    CommonModule,  // *ngIf, *ngFor 用
    FormsModule,   // [(ngModel)] 用
    RouterModule,  // routerLink 用
    // ng-zorro コンポーネント
    NzButtonModule,
    NzIconModule,
    // ...
  ],
  // ...
})
```

---

#### 4. `inject() must be called from an injection context`

**原因:** `inject()` が constructor または初期化フィールド以外で使用されている。

**解決策:** クラスフィールドで inject を使用するか、constructor 内で注入。

```typescript
// OK
export class MyComponent {
  private service = inject(MyService);
  
  constructor() {
    // constructor 内でも OK
    const another = inject(AnotherService);
  }
}

// NG
export class MyComponent {
  ngOnInit() {
    const service = inject(MyService);  // ← エラー
  }
}
```

---

## ヒントとベストプラクティス

### 1. 段階的に進める

一度に全てを変更せず、以下の順序で進めてください：

1. 子コンポーネント → 親コンポーネント
2. 各コンポーネント変更後にビルドして確認
3. エラーが出たらすぐに修正

### 2. テンプレートから依存を確認

コンポーネントの HTML テンプレートを確認し、使用している要素をリストアップ：

- `*ngIf`, `*ngFor` → `CommonModule`
- `[(ngModel)]` → `FormsModule`
- `[formGroup]` → `ReactiveFormsModule`
- `routerLink` → `RouterModule`
- `<nz-button>` → `NzButtonModule`
- カスタムコンポーネント → 直接インポート

### 3. ng-zorro のモジュール名

ng-zorro のモジュール名は規則的です：

```typescript
<nz-button>      → NzButtonModule
<nz-icon>        → NzIconModule
<nz-input>       → NzInputModule
<nz-form>        → NzFormModule
<nz-table>       → NzTableModule
```

### 4. コンパイルエラーを活用

TypeScript のコンパイルエラーは、不足している imports を教えてくれます。エラーメッセージをよく読んでください。

### 5. Git で変更を管理

各 Phase 完了後に commit することをお勧めします：

```bash
git add .
git commit -m "Phase 3: WySearch standalone 化完了"
```

問題が発生した場合、`git reset --hard HEAD` で戻すことができます。

---

## 完了後の最適化（オプション）

移行完了後、以下の最適化を検討できます：

### 1. 新テンプレート構文への移行

Angular V17 の `@if`, `@for`, `@switch` 構文への自動変換：

```bash
ng generate @angular/core:control-flow
```

### 2. Signals への移行

RxJS `BehaviorSubject` を Angular Signals に置き換え：

```typescript
// 修正前
private user$ = new BehaviorSubject<User | null>(null);

// 修正後
private user = signal<User | null>(null);
readonly userSignal = this.user.asReadonly();
```

### 3. Zoneless Change Detection

Angular V21 の zoneless 対応：

```typescript
// main.ts
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // ... 他の providers
  ]
};
```

---

## サポート

質問や問題が発生した場合：

1. このガイドの「トラブルシューティング」セクションを確認
2. Angular 公式ドキュメント: https://angular.dev/guide/standalone-components
3. ng-zorro standalone ドキュメント: https://ng.ant.design/docs/getting-started/en

---

**Good luck with your migration! 🚀**
