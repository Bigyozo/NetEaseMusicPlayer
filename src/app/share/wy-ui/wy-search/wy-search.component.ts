import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';
import { isEmptyObject } from 'src/app/utils/tools';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';

import { SearchResult } from '../../../services/data.types/common.types';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customView: TemplateRef<any>;
  @Input() searchResult: SearchResult;
  @Input() connectedRef: ElementRef;
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  @ViewChild('search', { static: false }) private defaultRef: ElementRef;

  @Output() onSearch = new EventEmitter<String>();

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchResult && !changes.searchResult.firstChange) {
      this.showOverlayPanel();
    }
  }

  private showOverlayPanel() {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.connectedRef || this.defaultRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ])
      .withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      //  hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    const panelRef = this.overlayRef.attach(panelPortal);
    panelRef.instance.searchResult = this.searchResult;
    // this.overlayRef.backdropClick().subscribe(() => {
    //   this.hideOverlayPanel();
    // });
  }

  private hideOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached) {
      this.overlayRef.dispose();
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input')
      .pipe(debounceTime(300), pluck('target', 'value'), distinctUntilChanged())
      .subscribe((value: string) => {
        this.onSearch.emit(value);
      });
  }

  ngOnInit() {}

  onFocus() {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  onBlur() {
    this.hideOverlayPanel();
  }
}
