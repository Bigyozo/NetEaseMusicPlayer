import { WINDOW } from 'src/app/services/services.module';
import { MemberState, ModalTypes } from 'src/app/store/reducers/member.reducer';

import { ESCAPE } from '@angular/cdk/keycodes';
import {
    BlockScrollStrategy, Overlay, OverlayKeyboardDispatcher, OverlayRef
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input,
    OnInit, Renderer2, ViewChild
} from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';

import { BatchActionsService } from '../../../../store/batch-actions.service';
import { AppStoreModule } from '../../../../store/index';
import { getModalType, getModalVisible } from '../../../../store/selectors/member.selectors';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  showModal: boolean = false;
  private visable: boolean = false;
  private currentModalType: ModalTypes = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;
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
    private rd: Renderer2
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
      this.currentModalType = type;
    }
  }

  private watchModalVisible(visible: boolean) {
    if (this.visable !== visible) {
      this.visable = visible;
      this.handleVisibleChange(visible);
    }
  }

  private handleVisibleChange(visible: boolean) {
    this.showModal = visible;
    if (visible) {
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
    } else {
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
    }
    this.cdr.markForCheck();
  }

  hide() {
    this.batchActionsService.controlModal(false);
  }
}
