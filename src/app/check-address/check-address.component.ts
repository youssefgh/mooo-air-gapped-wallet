import { Component } from '@angular/core';
import { BIP32Interface } from 'bip32';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../../environments/environment';
import { HdCoin } from '../core/bitcoinjs/hdCoin';
import { HdRoot } from '../core/bitcoinjs/hdRoot';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare var M: any;

@Component({
    selector: 'app-check-address',
    templateUrl: './check-address.component.html',
    styleUrls: ['./check-address.component.css'],
})
export class CheckAddressComponent {

    environment = environment;

    address: string;
    found: boolean;

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    static bip49Payment(publicKey: Buffer, network: bitcoinjs.Network) {
        return bitcoinjs.payments.p2sh({
            redeem: bitcoinjs.payments.p2wpkh({
                pubkey: publicKey,
                network
            }),
            network
        });
    }

    static bip84Payment(publicKey: Buffer, network: bitcoinjs.Network) {
        return bitcoinjs.payments.p2wpkh({
            pubkey: publicKey,
            network
        });
    }

    static payementFromPurpose(purpose: number) {
        let payement;
        switch (purpose) {
            case 84:
                payement = this.bip84Payment;
                break;
            case 49:
                payement = this.bip49Payment;
                break;
        }
        return payement;
    }

    onQrScan(text: string) {
        const mnemonic = this.sessionStorageService.mnemonic;

        for (const purpose of this.localStorageService.purposeArray) {
            const hdRoot = HdRoot.from(mnemonic, purpose, environment.network);
            const payement = CheckAddressComponent.payementFromPurpose(purpose);
            if (this.addressExist(text, hdRoot, purpose, payement)) {
                this.address = text;
                this.found = true;
                return;
            }
        }
        this.address = text;
        this.found = false;
    }

    addressExist(address: string, hdRoot: BIP32Interface, purpose: number, payement) {
        let accountNode: BIP32Interface;
        for (const walletAccount of this.localStorageService.walletAccountList) {
            accountNode = hdRoot.deriveHardened(purpose).deriveHardened(HdCoin.id(environment.network))
                .deriveHardened(walletAccount.index);
            let lastUsedExternalIndex = walletAccount.lastUsedExternalIndex(purpose);
            if (!lastUsedExternalIndex) {
                lastUsedExternalIndex = 0;
            }
            const searchLimit = lastUsedExternalIndex + this.localStorageService.gapLimit;
            for (let i = 0; i < searchLimit; i++) {
                const publicKey = accountNode.derive(0).derive(i).publicKey;
                const addressToCheck = payement(publicKey, environment.network).address;
                if (addressToCheck === address) {
                    return true;
                }
            }
        }
    }

    clear() {
        this.address = null;
    }

}
