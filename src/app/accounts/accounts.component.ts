import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { WalletAccount } from '../core/wallet-account';
import { LocalStorageService } from '../shared/local-storage.service';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent {

    environment = environment;

    walletAccountList: Array<WalletAccount>;

    constructor(
        private localStorageService: LocalStorageService,
    ) {
        this.walletAccountList = localStorageService.walletAccountList;
        if (this.walletAccountList.length === 0) {
            this.add();
        }
    }

    add() {
        const walletAccount = new WalletAccount();
        walletAccount.index = this.walletAccountList.length;
        walletAccount.name = 'Account ' + walletAccount.index;
        this.walletAccountList.push(walletAccount);
        this.localStorageService.saveWalletAccountList(this.walletAccountList);
    }
}
