import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HdCoin } from '../core/bitcoinjs/hdCoin';
import { HdRoot } from '../core/bitcoinjs/hdRoot';
import { WalletAccount } from '../core/wallet-account';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare var M: any;

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
        this.bip84ExtendedPublicKey = this.extendedPublicKey(84);
        if (this.showBip49) {
            this.bip49ExtendedPublicKey = this.extendedPublicKey(49);
        }
    }

    extendedPublicKey(purpose: number) {
        const hdRoot = HdRoot.from(this.sessionStorageService.mnemonic, purpose, environment.network);
        const accountNode = hdRoot.deriveHardened(purpose).deriveHardened(HdCoin.id(environment.network)).
            deriveHardened(this.selectedWalletAccount.index);
        return accountNode.neutered().toBase58();
    }
}
