import { Component } from '@angular/core';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../../environments/environment';
import { PsbtSigner } from '../core/psbt-signer';
import { PsbtTransactionDetails } from '../core/psbt-transaction-details';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

@Component({
    selector: 'app-sign-psbt',
    templateUrl: './sign-psbt.component.html',
    styleUrls: ['./sign-psbt.component.css'],
})
export class SignPsbtComponent {

    environment = environment;

    network = environment.network;

    signedPsbt: bitcoinjs.Psbt;
    psbtTransactionDetails: PsbtTransactionDetails;
    signedTransactionHex: string;

    psbtSigner = new PsbtSigner();

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrScan(text: string) {
        try {
            const signed = this.psbtSigner.sign(text, this.sessionStorageService.mnemonic, this.localStorageService.purposeArray, this.localStorageService.accountGapLimit, this.network);

            const lastUsedChangeIndex = this.localStorageService.walletAccountList[signed.accountResult.index].lastUsedChangeIndex(signed.purpose);

            this.psbtTransactionDetails = PsbtTransactionDetails.from(this.signedPsbt, signed.purpose, signed.accountNode,
                lastUsedChangeIndex, this.localStorageService.gapLimit, this.network);
            if (this.psbtTransactionDetails.maxChangeIndex) {
                this.localStorageService.walletAccountList[signed.accountResult.index].
                    updateLastUsedChangeIndex(this.psbtTransactionDetails.maxChangeIndex, signed.purpose);
                this.localStorageService.saveWalletAccountList(this.localStorageService.walletAccountList);
            }
            this.signedPsbt = signed.psbt;
        } catch (error) {
            if ((error as Error).message === PsbtSigner.ACCOUNT_NOT_FOUND) {
                alert('Account not found');
            }
            console.error((error as Error).stack);
        }
    }

    approveTransaction() {
        this.signedTransactionHex = this.signedPsbt.extractTransaction().toHex();
    }

}
