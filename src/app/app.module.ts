import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckAddressComponent } from './check-address/check-address.component';
import { CreateMnemonicComponent } from './create-mnemonic/create-mnemonic.component';
import { HomeComponent } from './home/home.component';
import { InitSessionComponent } from './init-session/init-session.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { QrCodeReaderComponent } from './qr-code-reader/qr-code-reader.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { SettingsComponent } from './settings/settings.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { SignPsbtComponent } from './sign-psbt/sign-psbt.component';

@NgModule({
  declarations: [
    AboutComponent,
    AccountComponent,
    AccountsComponent,
    AppComponent,
    CheckAddressComponent,
    CreateMnemonicComponent,
    HomeComponent,
    InitSessionComponent,
    NavigationBarComponent,
    QrCodeComponent,
    QrCodeReaderComponent,
    SettingsComponent,
    SideNavigationComponent,
    SignPsbtComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
