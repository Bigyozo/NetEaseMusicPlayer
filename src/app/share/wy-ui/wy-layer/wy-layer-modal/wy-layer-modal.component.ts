import { WINDOW } from 'src/app/services/services.module';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
    BlockScrollStrategy, Overlay, OverlayContainer, OverlayKeyboardDispatcher, OverlayRef
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
    Inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';

import { BatchActionsService } from '../../../../store/batch-actions.service';

@Component({
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
export class WyLayerModalComponent implements OnInit, AfterViewInit, OnChanges {
  modalTitle = {
    register: '注册',
    loginByPhone: '手机登陆',
    loginByEmail: '邮箱登陆',
    like: '收藏',
    share: '分享',
    default: ''
  };
  showModal = 'hide';
  @Input()
  visible: boolean = false;
  @Input()
  currentModalType: ModalTypes = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private overlayContainerEl: HTMLElement;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;

  private resizeHandler: () => void;

  constructor(
    @Inject(WINDOW) private win: Window,
    @Inject(DOCUMENT) private doc: Document,
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsService: BatchActionsService,
    private elementRef: ElementRef,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].firstChange) {
      this.handleVisibleChange(this.visible);
    }
  }

  ngAfterViewInit(): void {
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
    this.listenResizeToCenter();
  }

  private listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandler = this.rd.listen('window', 'resize', () =>
      this.keepCenter(modal, modalSize)
    );
  }

  private keepCenter(modal: HTMLElement, size: { w: number; h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
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
      this.showModal = 'show';
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
      this.changePointerEvents('none');
    }
    this.cdr.markForCheck();
  }

  // 屏蔽点击事件
  private changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  hide() {
    this.batchActionsService.controlModal(false);
  }
}
