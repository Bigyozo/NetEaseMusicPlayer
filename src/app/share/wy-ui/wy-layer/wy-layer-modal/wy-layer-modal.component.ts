import { WINDOW } from 'src/app/services/services.module';
import { MemberState, ModalTypes } from 'src/app/store/reducers/member.reducer';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
    BlockScrollStrategy, Overlay, OverlayContainer, OverlayKeyboardDispatcher, OverlayRef
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
    Inject, Input, OnInit, Output, Renderer2, ViewChild
} from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BatchActionsService } from '../../../../store/batch-actions.service';
import { AppStoreModule } from '../../../../store/index';
import { getModalType, getModalVisible } from '../../../../store/selectors/member.selectors';

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
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  showModal = 'hide';
  private visable: boolean = false;
  currentModalType: ModalTypes = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private overlayContainerEl: HTMLElement;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;
  @Output()
  onLoadMySheets = new EventEmitter<void>();
  private resizeHandler: () => void;

  constructor(
    @Inject(WINDOW) private win: Window,
    @Inject(DOCUMENT) private doc: Document,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsService: BatchActionsService,
    private elementRef: ElementRef,
    private rd: Renderer2,
    private overlayContainerServe: OverlayContainer
  ) {
    const appStore$ = this.store$.pipe(select(createFeatureSelector<MemberState>('member')));
    appStore$.pipe(select(getModalVisible)).subscribe((visible) => {
      this.watchModalVisible(visible);
    });
    appStore$.pipe(select(getModalType)).subscribe((type) => {
      this.watchModalType(type);
    });
    this.scrollStrategy = this.overlay.scrollStrategies.block();
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

  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets.emit();
      }
      this.currentModalType = type;
      this.cdr.markForCheck();
    }
  }

  private watchModalVisible(visible: boolean) {
    if (this.visable !== visible) {
      this.visable = visible;
      this.handleVisibleChange(visible);
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
