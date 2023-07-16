import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { WalletAccount } from '../core/wallet-account';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare const M: any;

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {

    environment = environment;

    selectedWalletAccount: WalletAccount;

    showBip49: boolean;

    bip86ExtendedPublicKey: string;
    bip86Descriptor: string;
    bip84ExtendedPublicKey: string;
    bip84Descriptor: string;
    bip49ExtendedPublicKey: string;
    bip49Descriptor: string;

    constructor(
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private sessionStorageService: SessionStorageService,
    ) {
        const accountIndex = parseInt(this.route.snapshot.paramMap.get('index'), 10);
        this.selectedWalletAccount = localStorageService.walletAccountList[accountIndex];
        this.showBip49 = localStorageService.showBip49;
        this.bip86ExtendedPublicKey = this.sessionStorageService.mnemonic.extendedPublicKey(86, this.selectedWalletAccount.index, environment.network);
        this.bip86Descriptor = this.sessionStorageService.mnemonic.descriptor(86, this.selectedWalletAccount.index, environment.network);
        this.bip84ExtendedPublicKey = this.sessionStorageService.mnemonic.extendedPublicKey(84, this.selectedWalletAccount.index, environment.network);
        this.bip84Descriptor = this.sessionStorageService.mnemonic.descriptor(84, this.selectedWalletAccount.index, environment.network);
        if (this.showBip49) {
            this.bip49ExtendedPublicKey = this.sessionStorageService.mnemonic.extendedPublicKey(49, this.selectedWalletAccount.index, environment.network);
            this.bip49Descriptor = this.sessionStorageService.mnemonic.descriptor(49, this.selectedWalletAccount.index, environment.network);
        }
    }

    ngOnInit() {
        const collapsibleElem = document.querySelector('.collapsible');
        M.Collapsible.init(collapsibleElem, {});
    }

}
