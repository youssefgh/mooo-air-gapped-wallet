import { BIP32Interface } from 'bip32';
import * as bitcoinjs from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';
import { AccountResult } from './account-result';
import { Base43 } from './base43';
import { HdCoin } from './bitcoinjs/hdCoin';
import { HdRoot } from './bitcoinjs/hdRoot';
import { Mnemonic } from './bitcoinjs/mnemonic';

export class PsbtSigner {

    static ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';

    sign(text: string, mnemonic: Mnemonic, purposeArray: Array<number>, accountGapLimit: number, network: Network) {
        const decoded = Base43.decode(text);
        const psbt = bitcoinjs.Psbt.fromBuffer(decoded);

        let purpose: number;
        let hdRoot: BIP32Interface;
        let accountNode: BIP32Interface;
        let accountResult: AccountResult;
        let i = 0;
        do {
            purpose = purposeArray[i];
            hdRoot = HdRoot.from(mnemonic, purpose, network);
            accountResult = this.searchCorespondingAccountNode(hdRoot, purpose, psbt, accountGapLimit, network);
            i++;
        } while (!accountResult && i < purposeArray.length);

        if (!accountResult) {
            throw new Error(PsbtSigner.ACCOUNT_NOT_FOUND);
        }
        accountNode = accountResult.accountNode;

        this.signAll(psbt, accountNode);
        psbt.finalizeAllInputs();

        return { psbt, accountResult, purpose, accountNode };
    }

    signAll(psbt: bitcoinjs.Psbt, accountNode: BIP32Interface) {
        for (let i = 0; i < psbt.txInputs.length; i++) {
            const firstBip32Derivation = psbt.data.inputs[i].bip32Derivation[0];
            const childPath = firstBip32Derivation.path.replace('m/', '');
            firstBip32Derivation.path = childPath;
            firstBip32Derivation.masterFingerprint = accountNode.fingerprint;
        }
        psbt.signAllInputsHD(accountNode);
    }

    signIndependently(psbt: bitcoinjs.Psbt, accountNode: BIP32Interface) {
        for (let i = 0; i < psbt.txInputs.length; i++) {
            const path = psbt.data.inputs[i].bip32Derivation[0].path.replace('m/', '');
            psbt.signInput(psbt.txInputs[i].index, accountNode.derivePath(path));
        }
    }

    searchCorespondingAccountNode(hdRoot: BIP32Interface, purpose: number, psbt: bitcoinjs.Psbt, accountGapLimit: number, network: Network) {
        let accountIndex = -1;
        let accountNode;
        const sampleBip32Derivation = psbt.data.inputs[0].bip32Derivation[0];
        const sampleChildPath = sampleBip32Derivation.path.replace('m/', '');
        do {
            accountIndex++;
            accountNode = hdRoot.deriveHardened(purpose).deriveHardened(HdCoin.id(network)).deriveHardened(accountIndex);
            if (sampleBip32Derivation.pubkey.equals(accountNode.derivePath(sampleChildPath).publicKey)) {
                return new AccountResult(accountNode, accountIndex);
            }
        } while (accountIndex < accountGapLimit);
        return null;
    }
}
