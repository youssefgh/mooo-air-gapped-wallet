import { Injectable } from '@angular/core';
import { WalletAccount } from '../core/wallet-account';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    mnemonicPhrase: string;
    mnemonicPassphraseHash: string;

    walletAccountList = new Array<WalletAccount>();

    showBip49: boolean;

    purposeArray = [84, 49];
    gapLimit = 100;
    accountGapLimit = 10;

    constructor() {
        this.init();
    }

    init() {
        this.mnemonicPhrase = window.localStorage.getItem('mnemonicPhrase');
        this.mnemonicPassphraseHash = window.localStorage.getItem('mnemonicPassphraseHash');

        const walletAccountListJson = window.localStorage.getItem('walletAccountList');
        if (walletAccountListJson) {
            this.walletAccountList = Object.assign(new Array<WalletAccount>(), JSON.parse(walletAccountListJson));
            for (let i = 0; i < this.walletAccountList.length; i++) {
                const walletAccount = this.walletAccountList[i];
                this.walletAccountList[i] = Object.assign(new WalletAccount(), walletAccount);
            }
        }

        this.showBip49 = (window.localStorage.getItem('showBip49') === 'true');
    }

    saveMnemonicPhrase(mnemonicPhrase: string) {
        this.mnemonicPhrase = mnemonicPhrase;
        window.localStorage.setItem('mnemonicPhrase', this.mnemonicPhrase);
    }

    saveMnemonicPassphraseHash(mnemonicPassphraseHash: string) {
        this.mnemonicPassphraseHash = mnemonicPassphraseHash;
        window.localStorage.setItem('mnemonicPassphraseHash', this.mnemonicPassphraseHash);
    }

    saveWalletAccountList(walletAccountList: Array<WalletAccount>) {
        this.walletAccountList = walletAccountList;
        window.localStorage.setItem('walletAccountList', JSON.stringify(this.walletAccountList));
    }

    saveShowBip49() {
        window.localStorage.setItem('showBip49', this.showBip49.toString());
    }

}
