import { Component } from '@angular/core';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mooo Air Gapped Wallet';

  constructor() {
    if (environment.network !== bitcoinjs.networks.bitcoin) {
      this.title += ' (Testnet)';
    }
  }

}
