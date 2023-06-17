import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoinjs from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { Bip32Network } from './bip32Network';
import { Mnemonic } from './mnemonic';

export class HdRoot {

    static from(mnemonic: Mnemonic, purpose: number, network: bitcoinjs.Network) {
        const seed = bip39.mnemonicToSeedSync(mnemonic.phrase, mnemonic.passphrase);
        const bip32Network = Bip32Network.from(purpose, network);
        return BIP32Factory(ecc).fromSeed(seed, { wif: network.wif, bip32: bip32Network });
    }

}
