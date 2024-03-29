import { ConfirmedTransaction } from './confirmed-transaction';
import { Derived } from './derived';

export class Utxo {

    transaction: ConfirmedTransaction;
    vout: number;
    satoshis: number;
    derived: Derived;
    transactionHex: string;

}
