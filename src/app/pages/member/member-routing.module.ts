import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CenterResolverService } from './center/center-resolve.service';
import { CenterComponent } from './center/center.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordResolverService } from './record-detail/record-resolve.service';

const routes: Routes = [
  {
    path: 'member/:id',
    component: CenterComponent,
    data: { title: '个人中心' },
    resolve: { user: CenterResolverService }
  },
  {
    path: 'records/:id',
    component: RecordDetailComponent,
    data: { title: '听歌记录' },
    resolve: { user: RecordResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CenterResolverService, RecordResolverService]
})
export class MemberRoutingModule {}
