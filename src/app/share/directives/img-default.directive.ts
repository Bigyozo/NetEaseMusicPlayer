import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appImgDefault]',
  standalone: true
})
export class ImgDefaultDirective {
  constructor() {}
  @HostListener('mousedown', ['$event']) onmousedown(event) {
    event.preventDefault();
  }
}
