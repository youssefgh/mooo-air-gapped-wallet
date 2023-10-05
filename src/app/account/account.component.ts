import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HdCoin } from '../core/bitcoinjs/hd-coin';
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

    bip86PublicDescriptor: string;
    bip84PublicDescriptor: string;
    bip49PublicDescriptor: string;
    bip48PublicDescriptorKey: string;

    constructor(
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private sessionStorageService: SessionStorageService,
    ) {
        const accountIndex = parseInt(this.route.snapshot.paramMap.get('index'), 10);
        this.selectedWalletAccount = localStorageService.walletAccountList[accountIndex];
        this.showBip49 = localStorageService.showBip49;
        const coinType = HdCoin.id(environment.network);
        this.bip86PublicDescriptor = this.sessionStorageService.mnemonic.deriveDescriptors(86, coinType, this.selectedWalletAccount.index, undefined, environment.network).publicDescriptor;
        this.bip84PublicDescriptor = this.sessionStorageService.mnemonic.deriveDescriptors(84, coinType, this.selectedWalletAccount.index, undefined, environment.network).publicDescriptor;
        this.bip48PublicDescriptorKey = this.sessionStorageService.mnemonic.deriveDescriptors(48, coinType, this.selectedWalletAccount.index, 2, environment.network).publicDescriptorKey;
        if (this.showBip49) {
            this.bip49PublicDescriptor = this.sessionStorageService.mnemonic.deriveDescriptors(49, coinType, this.selectedWalletAccount.index, undefined, environment.network).publicDescriptor;
        }
    }

    ngOnInit() {
        const collapsibleElem = document.querySelector('.collapsible');
        M.Collapsible.init(collapsibleElem, {});
    }

}
