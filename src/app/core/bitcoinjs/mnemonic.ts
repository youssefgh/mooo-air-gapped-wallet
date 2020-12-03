import * as bip39 from 'bip39';
import * as bitcoinjs from 'bitcoinjs-lib';
import { HdCoin } from './hdCoin';
import { HdRoot } from './hdRoot';

export class Mnemonic {

    phrase: string;
    passphrase: string;

    static new(strength: number) {
        const instance = new Mnemonic();
        instance.phrase = bip39.generateMnemonic(strength);
        return instance;
    }

    static passphraseHashFrom(passphrase: string) {
        return bitcoinjs.crypto.sha256(Buffer.from(passphrase)).toString('hex');
    }

    matchsKey(key: string, network: bitcoinjs.Network) {
        try {
            const purposeArray = [84, 49, 44];
            // TODO support other accounts
            const account = 0;
            for (const purpose of purposeArray) {
                const hdRoot = HdRoot.from(this, purpose, network);
                const pub = hdRoot.deriveHardened(purpose).deriveHardened(HdCoin.id(network)).deriveHardened(account).neutered().toBase58();
                if (pub === key) {
                    return true;
                }
            }
        } catch (e) {
        }
        return false;
    }

    phraseValid() {
        return bip39.validateMnemonic(this.phrase);
    }

    passphraseHash() {
        return Mnemonic.passphraseHashFrom(this.passphrase);
    }

    passphraseValid(mnemonicPassphraseHash: string) {
        return this.passphrase && Mnemonic.passphraseHashFrom(this.passphrase) === mnemonicPassphraseHash;
    }

}
