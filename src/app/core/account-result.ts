import { BIP32Interface } from 'bip32';

export class AccountResult {

    constructor(
        public accountNode: BIP32Interface,
        public index: number
    ) {
    }

}
