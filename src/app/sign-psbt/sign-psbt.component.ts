import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Psbt } from '../core/bitcoinjs/psbt';
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

    psbt: Psbt;
    psbtTransactionDetails: PsbtTransactionDetails;

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrScan(text: string) {
        try {
            let psbt: Psbt;
            try {
                psbt = Psbt.fromBase43(text, this.network);
            } catch (error) {
            }
            if (!psbt) {
                psbt = Psbt.fromBase64(text, this.network);
            }
            this.psbtTransactionDetails = PsbtTransactionDetails.from(psbt.object, this.network);
            this.psbt = psbt;
        } catch (error) {
            alert('Error while importing PSBT');
            console.error((error as Error).stack);
        }
    }

    sign() {
        this.psbt.sign(this.sessionStorageService.mnemonic);
        this.psbtTransactionDetails.calculateFees();
    }

}
