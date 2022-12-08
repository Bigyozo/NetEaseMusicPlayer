import { MemberState, ModalTypes } from 'src/app/store/reducers/member.reducer';

import { ESCAPE } from '@angular/cdk/keycodes';
import {
    BlockScrollStrategy, Overlay, OverlayKeyboardDispatcher, OverlayRef
} from '@angular/cdk/overlay';
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit
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
export class WyLayerModalComponent implements OnInit {
  showModal: boolean = false;
  private visable: boolean = false;
  private currentModalType: ModalTypes = ModalTypes.Default;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;

  constructor(
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsService: BatchActionsService,
    private elementRef: ElementRef
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
    } else {
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      // this.dismissOverlay();
    }
    this.cdr.markForCheck();
  }

  hide() {
    this.batchActionsService.controlModal(false);
  }
}
