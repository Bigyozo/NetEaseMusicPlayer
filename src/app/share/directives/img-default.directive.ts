import { Directive, HostListener } from '@angular/core';

@Directive({ standalone: false,
  selector: '[appImgDefault]'
})
export class ImgDefaultDirective {
  constructor() {}
  @HostListener('mousedown', ['$event']) onmousedown(event) {
    event.preventDefault();
  }
}
