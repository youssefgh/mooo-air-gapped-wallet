import { BIP32Interface } from 'bip32';
import * as bitcoinjs from 'bitcoinjs-lib';
import { WalletDestination } from './wallet-destination';

const SAT_IN_BITCOIN = 100000000;

export class PsbtTransactionDetails {

    fee: number;
    feeRate: number;
    walletDestinationList: Array<WalletDestination>;

    maxChangeIndex: number;

    static from(
        signedPsbt: bitcoinjs.Psbt,
        purpose: number,
        accountNode: BIP32Interface,
        lastUsedChangeIndex: number,
        gapLimit: number,
        network: bitcoinjs.Network
    ) {
        const instance = new PsbtTransactionDetails();
        instance.walletDestinationList = new Array();

        instance.fee = signedPsbt.getFee();
        instance.feeRate = signedPsbt.getFeeRate();

        const transaction = signedPsbt.extractTransaction();
        const outputs = transaction.outs;
        for (const output of outputs) {
            const walletDestination = new WalletDestination();
            walletDestination.address = bitcoinjs.address.fromOutputScript(output.script, network);
            walletDestination.amount = output.value / SAT_IN_BITCOIN;
            const changeIndex = walletDestination.changeIndex(purpose, accountNode, lastUsedChangeIndex, gapLimit, network);
            if (changeIndex) {
                if (!instance.maxChangeIndex || instance.maxChangeIndex < changeIndex) {
                    instance.maxChangeIndex = changeIndex;
                }
                continue;
            }
            instance.walletDestinationList.push(walletDestination);
        }
        return instance;
    }

}
