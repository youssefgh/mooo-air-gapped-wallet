import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Mnemonic } from '../core/bitcoinjs/mnemonic';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare var M: any;

@Component({
    selector: 'app-init-session',
    templateUrl: './init-session.component.html',
    styleUrls: ['./init-session.component.css'],
})
export class InitSessionComponent {

    environment = environment;

    mnemonic: Mnemonic;
    mnemonicPassphraseHash: string;

    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
        private sessionStorageService: SessionStorageService,
    ) {
        if (this.sessionStorageService.mnemonic) {
            this.router.navigateByUrl('home');
            return;
        }
        this.mnemonic = new Mnemonic();
        this.mnemonic.phrase = localStorageService.mnemonicPhrase;
        this.mnemonicPassphraseHash = localStorageService.mnemonicPassphraseHash;
        if (!this.mnemonicPassphraseHash) {
            sessionStorageService.saveMnemonic(this.mnemonic);
            this.router.navigateByUrl('home');
        }
    }

    openWallet() {
        if (this.mnemonic.passphraseValid(this.mnemonicPassphraseHash)) {
            this.sessionStorageService.saveMnemonic(this.mnemonic);
            this.router.navigateByUrl('home');
        } else {
            M.toast({ html: 'Incorrect passphrase !', classes: 'red' });
        }
    }

}
