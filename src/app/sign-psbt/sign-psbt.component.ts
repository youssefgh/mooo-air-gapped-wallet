import { Component } from '@angular/core';
import { URDecoder } from '@ngraveio/bc-ur';
import { environment } from '../../environments/environment';
import { Psbt, SignResult } from '../core/bitcoinjs/psbt';
import { PsbtTransactionDetails } from '../core/psbt-transaction-details';
import { UrDecoderUtils } from '../core/ur-decoder-utils';
import { UrEncoderUtils } from '../core/ur-encoder-utils';
import { QrCodeReaderComponent } from '../qr-code-reader/qr-code-reader.component';
import { SessionStorageService } from '../shared/session-storage.service';

declare const M: any;

@Component({
    selector: 'app-sign-psbt',
    templateUrl: './sign-psbt.component.html',
    styleUrls: ['./sign-psbt.component.css'],
})
export class SignPsbtComponent {

    environment = environment;
    qrCodeReaderComponent: QrCodeReaderComponent;
    urDecoder = new URDecoder();

    psbt: Psbt;
    psbtTransactionDetails: PsbtTransactionDetails;
    signResult: SignResult;
    selectedQrList: Array<string>;

    constructor(
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrReaderCreated(qrCodeReaderComponent: QrCodeReaderComponent) {
        this.qrCodeReaderComponent = qrCodeReaderComponent;
    }

    onQrScan(text: string) {
        let psbtString: string;
        if (UrDecoderUtils.isUr(text)) {
            const ur = UrDecoderUtils.decode(text, this.urDecoder);
            if (ur.error) {
                M.toast({ html: `${ur.error} !`, classes: 'red' });
                console.error(ur.error);
                return;
            }
            if (ur.message) {
                psbtString = ur.message;
            }
        } else {
            psbtString = text;
        }
        if (psbtString) {
            this.qrCodeReaderComponent.stopDecodeFromVideoDevice();
            M.toast({ html: `Qr read completed`, classes: 'green' });
            this.urDecoder = new URDecoder();

            try {
                let psbt: Psbt;
                try {
                    psbt = Psbt.fromBase43(psbtString, this.environment.network);
                } catch (error) {
                }
                if (!psbt) {
                    psbt = Psbt.fromBase64(psbtString, this.environment.network);
                }
                this.psbtTransactionDetails = PsbtTransactionDetails.fromSigned(this.sessionStorageService.mnemonic, psbt.object, this.environment.network);
                this.psbt = psbt;
            } catch (error) {
                M.toast({ html: 'Error while importing PSBT !', classes: 'red' });
                console.error((error as Error).stack);
            }
        }
    }

    onSourceQrScanError(error: string) {
        M.toast({ html: `${error} !`, classes: 'red' });
    }

    sign() {
        const signResult = this.psbt.sign(this.sessionStorageService.mnemonic);
        if (signResult.signedTransaction) {
            this.psbtTransactionDetails.calculateFees();
        }

        let qr: string;
        if (signResult.signedTransaction) {
            qr = signResult.signedTransaction;
        } else if (signResult.psbtBase64) {
            qr = signResult.psbtBase64;
        }
        if (qr) {
            if (qr.length < 1000) {
                this.selectedQrList = [qr];
            } else if (signResult.signedTransaction) {
                this.selectedQrList = UrEncoderUtils.encodeBytes(qr);
            } else if (signResult.psbtBase64) {
                this.selectedQrList = UrEncoderUtils.encodePsbt(qr);
            }
        }

        this.signResult = signResult;
    }

}
