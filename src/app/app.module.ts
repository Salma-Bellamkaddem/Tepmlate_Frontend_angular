import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { authInterceptorProviders } from './CoopStore/interceptors/auth.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [ authInterceptorProviders, { provide: LocationStrategy, useClass: PathLocationStrategy }],
    bootstrap: [AppComponent],
})
export class AppModule {}
