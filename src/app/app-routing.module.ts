import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CheckAddressComponent } from './check-address/check-address.component';
import { CreateMnemonicComponent } from './create-mnemonic/create-mnemonic.component';
import { HomeComponent } from './home/home.component';
import { InitSessionComponent } from './init-session/init-session.component';
import { SettingsComponent } from './settings/settings.component';
import { SignPsbtComponent } from './sign-psbt/sign-psbt.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'account/:index',
    component: AccountComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'checkAddress',
    component: CheckAddressComponent
  },
  {
    path: 'createMnemonic',
    component: CreateMnemonicComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'initSession',
    component: InitSessionComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'signPsbt',
    component: SignPsbtComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
