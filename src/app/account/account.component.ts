import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { WalletAccount } from '../core/wallet-account';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
})
export class AccountComponent {

    environment = environment;

    selectedWalletAccount: WalletAccount;

    showBip49: boolean;

    bip84ExtendedPublicKey: string;
    bip49ExtendedPublicKey: string;

    constructor(
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private sessionStorageService: SessionStorageService,
    ) {
        const accountIndex = parseInt(this.route.snapshot.paramMap.get('index'), 10);
        this.selectedWalletAccount = localStorageService.walletAccountList[accountIndex];
        this.showBip49 = localStorageService.showBip49;
        this.bip84ExtendedPublicKey = this.sessionStorageService.mnemonic.extendedPublicKey(84, this.selectedWalletAccount.index, environment.network);
        if (this.showBip49) {
            this.bip49ExtendedPublicKey = this.sessionStorageService.mnemonic.extendedPublicKey(49, this.selectedWalletAccount.index, environment.network);
        }
    }

}
