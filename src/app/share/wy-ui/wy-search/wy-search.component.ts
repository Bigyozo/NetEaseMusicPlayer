import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef,
    ViewChild
} from '@angular/core';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit {
  @Input() customView: TemplateRef<any>;
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  @Output() onSearch = new EventEmitter<String>();
  constructor() {}

  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input')
      .pipe(debounceTime(300), pluck('target', 'value'), distinctUntilChanged())
      .subscribe((value: string) => {
        this.onSearch.emit(value);
      });
  }

  ngOnInit() {}
}
