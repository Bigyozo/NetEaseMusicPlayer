import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visible = changes['visible'];
    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched();
    }
  }

  ngOnInit() {}
}
