import * as bitcoinjs from 'bitcoinjs-lib';
import { Mnemonic } from './mnemonic';

describe('Mnemonic', () => {

  it(`should generate good passphrase`, async () => {
    const instance = Mnemonic.new(256);
    await expect(instance.phrase.split(' ').length).toEqual(24);
  });

  it(`should generate bip84 extendedPublicKey`, async () => {
    const instance = new Mnemonic();
    instance.phrase = 'wool bullet crunch trend acoustic text swap flash video news bless second';
    const purpose = 84;
    const index = 0;
    const network = bitcoinjs.networks.testnet;

    const result = instance.extendedPublicKey(purpose, index, network);

    await expect(result).toEqual('vpub5ZqrnySakdddTRRShAgBt9TDMDHvSPSey8W3DjVisfLKnHF9GGYg3Xh3qDY7iyXXomdMSRanqyTKa2awoN7fdbZmsjAuekDPvQhmCMsWWGZ');
  });

  it(`should generate bip49 extendedPublicKey`, async () => {
    const instance = new Mnemonic();
    instance.phrase = 'wool bullet crunch trend acoustic text swap flash video news bless second';
    const purpose = 49;
    const index = 0;
    const network = bitcoinjs.networks.testnet;

    const result = instance.extendedPublicKey(purpose, index, network);

    await expect(result).toEqual('upub5ERcwTAtRfcHguSmdtcTduRNLi6BJDZTZKc6SCLVdudnwCqRbBLmNyfidU4oGVEqR5MspbYmtEFcos5hdN3sSBa7Zqzm6Ct7SBEAAU5EFEG');
  });

});
