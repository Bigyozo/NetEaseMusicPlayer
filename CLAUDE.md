# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start dev server (requires backend API running on port 3000)
npm run start

# Build for production (outputs to www/)
npm run build

# Watch mode build
npm run watch

# Serve the built app with proxy to backend
node server.js
```

### Testing
```bash
npm run test
```

### Backend dependency
Before running, start the NeteaseCloudMusicApi backend:
```bash
docker pull binaryify/netease_cloud_music_api
docker run -d -p 3000:3000 --name netease_cloud_music_api binaryify/netease_cloud_music_api
```
The dev proxy in `proxyconfig.json` forwards `/api/**` to `http://127.0.0.1:3000/`. In production (`server.js`), `API_IP` and `API_PORT` env vars configure the target.

## Architecture

**Stack:** Angular 21, NgRx 21, ng-zorro-antd, LESS, BetterScroll

### Module structure

- `CoreModule` — singleton module imported only by `AppModule`. Bootstraps routing, HTTP, animations, ServicesModule, PagesModule, ShareModule, and AppStoreModule.
- `ServicesModule` — provides the `API_CONFIG` injection token (value `'/api/'`) used by all services, and the HTTP interceptor. Services are `providedIn: ServicesModule`.
- `AppStoreModule` — NgRx store with two feature slices: `player` and `member`.
- `ShareModule` — shared UI components (player, slider, search, layer/modal system).
- `PagesModule` — lazy-loaded page modules via router.

### Routing (lazy-loaded)
| Path | Module |
|------|--------|
| `/home` | HomeModule |
| `/sheet` | SheetListModule |
| `/sheetInfo/:id` | SheetInfoModule |
| `/singer/:id` | SingerModule |
| `/songInfo/:id` | SongInfoModule |

Pages use Angular route resolvers (e.g., `HomeResolveService`, `SheetInfoResolverService`) to pre-fetch data before component activation.

### NgRx Store

Two slices in `src/app/store/`:

**`player` slice** (`PlayState`):
- `songList` — master ordered list
- `playList` — actual playback list (may be shuffled)
- `currentIndex`, `currentSong`, `playMode` (`loop` | `random` | `singleLoop`), `isPlaying`, `currentAction` (`CurrentActions` enum)

**`member` slice** (`MemberState`):
- `modalVisible`, `modalType` (`ModalTypes` enum), `userId`, `likeId`, `shareInfo`

`BatchActionsService` (`src/app/store/batch-actions.service.ts`) encapsulates multi-action sequences (insert/delete/clear songs, control modal, like song). Prefer dispatching through this service rather than dispatching individual actions directly.

### Key shared components

- **`WyPlayerComponent`** (`src/app/share/wy-ui/wy-player/`) — the persistent bottom player bar. Renders on every page. Subscribes to the `player` store slice. Contains `WyPlayerPanelComponent` (playlist panel with lyrics scroll).
- **`WySliderComponent`** (`src/app/share/wy-ui/wy-slider/`) — custom draggable slider implementing `ControlValueAccessor`. Handles both mouse and touch events. Used for seek bar and volume.
- **`WyLyric`** (`src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric.ts`) — standalone class (not a component) that parses LRC lyric format and emits line events via an RxJS `Subject` on a timer.
- **`WyLayerModalComponent`** (`src/app/share/wy-ui/wy-layer/wy-layer-modal/`) — modal shell using Angular CDK Overlay. Child components handle register, phone/email login, like, and share flows.

### API service pattern

All services (`HomeService`, `SheetService`, `SongService`, `SingerService`, `MemberService`, `SearchService`) inject `API_CONFIG` token for the base URL and `HttpClient`. HTTP calls go to `/api/<endpoint>` which the proxy rewrites to the NeteaseCloudMusicApi backend. The common interceptor adds `withCredentials: true` to all requests (required for session cookies).

### i18n

`LanguageService` holds a `BehaviorSubject<Language>` with codes `'ch'` | `'en'`. Language resource objects (`LANGUAGE_CH`, `LANGUAGE_EN`) in `src/app/language/` use string keys (e.g., `C00001`). Components subscribe to `languageService.language$` and bind to `lanRes[keyCode]` in templates.

### Styling

Global styles in `src/assets/styles/` (variables, mixins, layout, zorro overrides). Component styles use LESS. The Angular project is configured with `skipTests: true` for all schematics — there are no unit test files for components.

全ての会話は日本語で回答してください
