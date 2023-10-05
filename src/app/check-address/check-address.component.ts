import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HdCoin } from '../core/bitcoinjs/hd-coin';
import { Mnemonic } from '../core/bitcoinjs/mnemonic';
import { QrCodeReaderComponent } from '../qr-code-reader/qr-code-reader.component';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

@Component({
    selector: 'app-check-address',
    templateUrl: './check-address.component.html',
    styleUrls: ['./check-address.component.css'],
})
export class CheckAddressComponent {

    environment = environment;
    qrCodeReaderComponent: QrCodeReaderComponent;

    address: string;
    found: boolean;

    scanRange = 1000;
    fromIndex = 0;
    toIndex = this.scanRange;

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrReaderCreated(qrCodeReaderComponent: QrCodeReaderComponent) {
        this.qrCodeReaderComponent = qrCodeReaderComponent;
    }

    onQrScan(text: string) {
        const mnemonic = this.sessionStorageService.mnemonic;

        const purpose = this.purposeOf(text);
        if (this.addressExist(text, mnemonic, purpose)) {
            this.found = true;
        } else {
            this.found = false;
        }
        this.address = text;
    }

    addressExist(address: string, mnemonic: Mnemonic, purpose: number) {
        const coinType = HdCoin.id(environment.network);
        for (const walletAccount of this.localStorageService.walletAccountList) {
            for (const change of [0, 1]) {
                const derivedList = mnemonic.deriveList(purpose, coinType, walletAccount.index, undefined, change, this.fromIndex, this.toIndex, environment.network).derivedArray;
                for (const derived of derivedList) {
                    if (derived.address.value === address) {
                        return true;
                    }
                }
            }
        }
    }

    more() {
        this.fromIndex = this.toIndex;
        this.toIndex += this.scanRange;
        this.onQrScan(this.address);
    }

    purposeOf(address: string): number {
        if (address.startsWith('bc1p') || address.startsWith('tb1p') || address.startsWith('bcrt1p')) {
            return 86;
        } else if (address.startsWith('bc1q') || address.startsWith('tb1q') || address.startsWith('bcrt1q')) {
            return 84;
        } else if (address.startsWith('3') || address.startsWith('2')) {
            return 49;
        } else if (address.startsWith('1') || address.startsWith('m') || address.startsWith('n')) {
            return 44;
        }
    }

    clear() {
        this.address = null;
    }

}
