import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Psbt, SignResult } from '../core/bitcoinjs/psbt';
import { PsbtTransactionDetails } from '../core/psbt-transaction-details';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';
import { QrCodeReaderComponent } from '../qr-code-reader/qr-code-reader.component';

@Component({
    selector: 'app-sign-psbt',
    templateUrl: './sign-psbt.component.html',
    styleUrls: ['./sign-psbt.component.css'],
})
export class SignPsbtComponent {

    environment = environment;
    qrCodeReaderComponent: QrCodeReaderComponent;

    psbt: Psbt;
    psbtTransactionDetails: PsbtTransactionDetails;
    signResult: SignResult;

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrReaderCreated(qrCodeReaderComponent: QrCodeReaderComponent) {
        this.qrCodeReaderComponent = qrCodeReaderComponent;
    }

    onQrScan(text: string) {
        try {
            let psbt: Psbt;
            try {
                psbt = Psbt.fromBase43(text, this.environment.network);
            } catch (error) {
            }
            if (!psbt) {
                psbt = Psbt.fromBase64(text, this.environment.network);
            }
            this.psbtTransactionDetails = PsbtTransactionDetails.from(psbt.object, this.environment.network);
            this.psbt = psbt;
        } catch (error) {
            alert('Error while importing PSBT');
            console.error((error as Error).stack);
        }
    }

    sign() {
        const signResult = this.psbt.sign(this.sessionStorageService.mnemonic);
        if (signResult?.signedTransaction) {
            this.psbtTransactionDetails.calculateFees();
        }
        this.signResult = signResult;
    }

}
