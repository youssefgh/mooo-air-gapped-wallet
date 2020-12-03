import { Injectable } from '@angular/core';
import { Mnemonic } from '../core/bitcoinjs/mnemonic';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

    mnemonic: Mnemonic;

    constructor() {
        this.init();
    }

    init() {
        const mnemonicJson = window.sessionStorage.getItem('mnemonic');
        if (mnemonicJson) {
            this.mnemonic = Object.assign(new Mnemonic(), JSON.parse(mnemonicJson));
        }
    }

    saveMnemonic(mnemonic: Mnemonic) {
        this.mnemonic = mnemonic;
        window.sessionStorage.setItem('mnemonic', JSON.stringify(this.mnemonic));
    }

}
