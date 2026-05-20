import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { LANGUAGE_JP } from 'src/app/language/jp';
import { LanguageService } from 'src/app/services/language.service';
import { isEmptyObject } from 'src/app/utils/tools';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef,
  effect, input, output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { LanguageRes, SearchResult } from '../../../services/data.types/common.types';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-wy-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzIconModule
  ],
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit {
  lanRes: LanguageRes = LANGUAGE_JP;
  customView = input<TemplateRef<any>>();
  searchResult = input<SearchResult>();
  connectedRef = input<ElementRef>();
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  @ViewChild('search', { static: false }) private defaultRef: ElementRef;

  onSearch = output<String>();

  private overlayRef: OverlayRef;
  private searchResultFirstRun = true;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private languageService: LanguageService
  ) {
    this.languageService.language$.subscribe((item) => {
      this.lanRes = item.res;
    });
    effect(() => {
      this.searchResult();
      if (this.searchResultFirstRun) { this.searchResultFirstRun = false; return; }
      this.showOverlayPanel();
    });
  }

  private showOverlayPanel() {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.connectedRef() || this.defaultRef)
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
    panelRef.instance.searchResult = this.searchResult();
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

  ngOnInit() { }

  onFocus() {
    if (this.searchResult() && !isEmptyObject(this.searchResult())) {
      this.showOverlayPanel();
    }
  }

  onBlur() {
    this.hideOverlayPanel();
  }
}
