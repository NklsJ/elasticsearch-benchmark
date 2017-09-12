import { BrowserModule } from '@angular/platform-browser';
// import { WorkerAppModule } from '@angular/platform-webworker';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XSRFStrategy, Request } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';

class CustomXSRFStrategy extends XSRFStrategy {
    public configureRequest(req: Request) { /* */ }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    // WorkerAppModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  // providers: [{ provide: XSRFStrategy, useValue: new CustomXSRFStrategy() }],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
