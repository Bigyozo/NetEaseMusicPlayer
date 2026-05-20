import { ModalTypes } from 'src/app/store/reducers/member.reducer';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  BlockScrollStrategy,
  Overlay,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayRef
} from '@angular/cdk/overlay';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { BatchActionsService } from '../../../../store/batch-actions.service';

interface SizeType {
  w: number;
  h: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, DragDropModule, NzSpinModule],
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHide', [
      state('show', style({ transform: 'scale(1)', opacity: 1 })),
      state('hide', style({ transform: 'scale(0)', opacity: 0 })),
      transition('show<=>hide', animate('0.1s'))
    ])
  ]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  modalTitle = {
    register: '登録',
    loginByPhone: '電話番号でログイン',
    loginByEmail: 'メールアドレスでログイン',
    like: 'お気に入り',
    share: 'シェア',
    default: ''
  };
  visible = input(false);
  showSpin = input(false);
  currentModalType = input<ModalTypes>(ModalTypes.Default);
  showModal = computed(() => this.visible() ? 'show' : 'hide');
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private overlayContainerEl: HTMLElement;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;

  private plateformId = inject<object>(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private resizeHandler: () => void;
  private isBrowser: boolean;
  private visibleFirstRun = true;
  constructor(
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private batchActionsService: BatchActionsService,
    private elementRef: ElementRef,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block();
    this.isBrowser = isPlatformBrowser(this.plateformId);
    effect(() => {
      const v = this.visible();
      if (this.visibleFirstRun) { this.visibleFirstRun = false; return; }
      this.handleVisibleChange(v);
    });
  }

  ngAfterViewInit(): void {
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
    this.listenResizeToCenter();
  }

  private listenResizeToCenter() {
    if (this.isBrowser) {
      const modal = this.modalRef.nativeElement;
      const modalSize = this.getHideDomSize(modal);
      this.keepCenter(modal, modalSize);
      this.resizeHandler = this.rd.listen('window', 'resize', () =>
        this.keepCenter(modal, modalSize)
      );
    }
  }

  private keepCenter(modal: HTMLElement, size: SizeType) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize() {
    return {
      w: window.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: window.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    };
  }

  private getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    };
  }

  ngOnInit() {
    this.createOverlay();
  }

  private createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe((e) => this.keydownListener(e));
  }

  private keydownListener(evt: KeyboardEvent): void {
    if (evt.keyCode == ESCAPE) {
      this.hide();
    }
  }

  private handleVisibleChange(visible: boolean) {
    if (visible) {
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler?.();
      this.changePointerEvents('none');
    }
  }

  // クリックイベントをブロック
  private changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  hide() {
    this.batchActionsService.controlModal(false);
  }
}
