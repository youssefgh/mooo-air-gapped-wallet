import { BIP32Interface } from 'bip32';
import * as bitcoinjs from 'bitcoinjs-lib';

export class WalletDestination {

    address: string;
    amount: number;

    static addressFrom(purpose: number, publicKey: Buffer, network: bitcoinjs.Network) {
        let address;
        switch (purpose) {
            case 84:
                address = this.bip84Payment(publicKey, network).address;
                break;
            case 49:
                address = this.bip49Payment(publicKey, network).address;
                break;
        }
        return address;
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

    changeIndex(
        purpose: number,
        accountNode: BIP32Interface,
        lastUsedChangeIndex: number,
        gapLimit: number,
        network: bitcoinjs.Network,
    ): number {
        let startIndex = 0;
        if (lastUsedChangeIndex) {
            startIndex = lastUsedChangeIndex + 1;
        }
        for (let i = startIndex; i < gapLimit; i++) {
            const publicKey = accountNode.derive(1).derive(i).publicKey;
            const changeAddress = WalletDestination.addressFrom(purpose, publicKey, network);
            if (this.address === changeAddress) {
                return i;
            }
        }
        for (let i = 0; i < startIndex; i++) {
            const publicKey = accountNode.derive(1).derive(i).publicKey;
            const changeAddress = WalletDestination.addressFrom(purpose, publicKey, network);
            if (this.address === changeAddress) {
                return i;
            }
        }
    }

}
