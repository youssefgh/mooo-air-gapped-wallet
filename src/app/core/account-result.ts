import * as bitcoinjs from 'bitcoinjs-lib';

export class AccountResult {

    constructor(
        public accountNode: bitcoinjs.BIP32Interface,
        public index: number
    ) {
    }

}
