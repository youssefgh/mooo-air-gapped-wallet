import { Component } from '@angular/core';
import * as bitcoinjs from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mooo Air Gapped Wallet';

  constructor() {
    bitcoinjs.initEccLib(ecc);
    if (environment.network !== bitcoinjs.networks.bitcoin) {
      this.title += ' (Testnet)';
    }
  }

}
