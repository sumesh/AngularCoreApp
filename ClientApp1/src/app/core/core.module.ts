import { NgModule, Optional, SkipSelf } from '@angular/core';
import { LayoutModuleModule } from '../layout/layout.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule,LayoutModuleModule],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    core: CoreModule
  ) {
    if (core) {
      throw new Error('Core Module can only be imported to AppModule.');
    }
  }
}
