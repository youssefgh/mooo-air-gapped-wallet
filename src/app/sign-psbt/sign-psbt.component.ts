import { Component } from '@angular/core';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../../environments/environment';
import { AccountResult } from '../core/account-result';
import { Base43 } from '../core/base43';
import { HdCoin } from '../core/bitcoinjs/hdCoin';
import { HdRoot } from '../core/bitcoinjs/hdRoot';
import { PsbtTransactionDetails } from '../core/psbt-transaction-details';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare var M: any;

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

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
    }

    onQrScan(text: string) {
        const mnemonic = this.sessionStorageService.mnemonic;
        const decoded = Base43.decode(text);
        const psbt = bitcoinjs.Psbt.fromBuffer(decoded);

        let purpose: number;
        let hdRoot: bitcoinjs.BIP32Interface;
        let accountNode: bitcoinjs.BIP32Interface;
        let accountResult: AccountResult;
        let i = 0;
        do {
            purpose = this.localStorageService.purposeArray[i];
            hdRoot = HdRoot.from(mnemonic, purpose, this.network);
            accountResult = this.searchCorespondingAccountNode(hdRoot, purpose, psbt);
            i++;
        } while (!accountResult && i < this.localStorageService.purposeArray.length);

        if (!accountResult) {
            alert('Account not found');
            return;
        }
        accountNode = accountResult.accountNode;

        this.signAll(psbt, accountNode);
        psbt.finalizeAllInputs();

        this.signedPsbt = psbt;

        const lastUsedChangeIndex = this.localStorageService.walletAccountList[accountResult.index].lastUsedChangeIndex(purpose);

        this.psbtTransactionDetails = PsbtTransactionDetails.from(this.signedPsbt, purpose, accountNode,
            lastUsedChangeIndex, this.localStorageService.gapLimit, this.network);
        if (this.psbtTransactionDetails.maxChangeIndex) {
            this.localStorageService.walletAccountList[accountResult.index].
                updateLastUsedChangeIndex(this.psbtTransactionDetails.maxChangeIndex, purpose);
            this.localStorageService.saveWalletAccountList(this.localStorageService.walletAccountList);
        }
    }

    approveTransaction() {
        this.signedTransactionHex = this.signedPsbt.extractTransaction().toHex();
    }

    signAll(psbt: bitcoinjs.Psbt, accountNode: bitcoinjs.BIP32Interface) {
        for (let i = 0; i < psbt.txInputs.length; i++) {
            const firstBip32Derivation = psbt.data.inputs[i].bip32Derivation[0];
            const childPath = firstBip32Derivation.path.replace('m/', '');
            firstBip32Derivation.path = childPath;
            firstBip32Derivation.masterFingerprint = accountNode.fingerprint;
        }
        psbt.signAllInputsHD(accountNode);
    }

    signIndependently(psbt: bitcoinjs.Psbt, accountNode: bitcoinjs.BIP32Interface) {
        for (let i = 0; i < psbt.txInputs.length; i++) {
            const path = psbt.data.inputs[i].bip32Derivation[0].path.replace('m/', '');
            psbt.signInput(psbt.txInputs[i].index, accountNode.derivePath(path));
        }
    }

    searchCorespondingAccountNode(hdRoot: bitcoinjs.BIP32Interface, purpose: number, psbt: bitcoinjs.Psbt) {
        let accountIndex = -1;
        let accountNode;
        const sampleBip32Derivation = psbt.data.inputs[0].bip32Derivation[0];
        const sampleChildPath = sampleBip32Derivation.path.replace('m/', '');
        do {
            accountIndex++;
            accountNode = hdRoot.deriveHardened(purpose).deriveHardened(HdCoin.id(this.network)).deriveHardened(accountIndex);
            if (sampleBip32Derivation.pubkey.equals(accountNode.derivePath(sampleChildPath).publicKey)) {
                return new AccountResult(accountNode, accountIndex);
            }
        } while (accountIndex < this.localStorageService.accountGapLimit);
        return null;
    }
}
