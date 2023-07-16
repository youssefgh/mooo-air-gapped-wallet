import * as bitcoinjs from 'bitcoinjs-lib';
import { Mnemonic } from '../src/app/core/bitcoinjs/mnemonic';
import { Psbt } from '../src/app/core/bitcoinjs/psbt';

describe('PsbtSigner', () => {

  it(`should not sign when mnemonic is different`, () => {
    const text = 'cHNidP8BAHECAAAAAbftTaU4oibD/kW4UuqG6VdPDn+AAddxfr1ORxs1In86AQAAAAD9////AqCGAQAAAAAAFgAU5oWAo35pGRpBve4vZuSf/RJ1l2usuIYAAAAAABYAFLob/Ay3/Fh09j461ZNq7kr9xDGDFD8lAAABAR/fP4gAAAAAABYAFMGTrvcmAlKD1XeIBJ2VhWvvXSIVAQD9FAICAAAAAAEDhx39Hm/Q+IEzeHzEIQR8hBFoWzQ7BgBNoq874UoXMI8AAAAAAP////+HEku25SJEM3C2XreROh/mAz9b3TV8pcEqT+zkrmDmbQAAAAAA/////yVr+qF09nHcVW8ARJTTnS0ZAzqBnSZjMBkGfl8wTKWOAQAAAAD/////AkBCDwAAAAAAIlEgD6fPGREBB8wuXHhOWjo7IPSS18oTbjir40WX7rJkP/vfP4gAAAAAABYAFMGTrvcmAlKD1XeIBJ2VhWvvXSIVAkgwRQIhAMsS8DNQhm1nKNVdL7owODpSrzeT2g08Jle8DzuMXEeBAiAHWR4cgpVAb+iHfMC9mpANFSNbjX0AjEdzZoC3kdygFAEhA2lmae3eHVT5DXJO+hSE/TOpI+5+D8qh1leRl5bL3O11AkcwRAIgdBOmAZuhELYvPJnbkRiCzGeYFgQ/MfoLNrsSVaSKeykCIDKQy+g6SeDBs6kJyXfVFlwXBFEpNcXmuA3lx6gDYTJUASECowQJtYhfXkPjBAHvC75lkFV5iSySYhty0FuAZMKtNksCSDBFAiEAua9he0HPwnRRYirYosDYyOjHYjcaEutLHeC0OYyk8S4CIChY/8DJ5nrodq3v6uLVnz/REsvPflTJ0ZFCdAtZWHy0ASECTmFJCY3OFzc/ljonlf5/eZVJQ5bfpheqaBJKdcswCnsAAAAAIgYDSAQOnCYCKWLs9oZ+yc+h54A6wej0RJ91nJU5HAuRAV0Yvc6JwFQAAIABAACAAAAAgAEAAAAKAAAAAAAiAgJgB8m777kJYRcdc9oPiSIpke67GbC33a2h9dntzSO/vhi9zonAVAAAgAEAAIAAAACAAQAAAAgAAAAA';
    const mnemonic = Mnemonic.new(256);
    const network = bitcoinjs.networks.testnet;
    const instance = Psbt.fromBase64(text, network);

    expect(() => instance.sign(mnemonic)).toThrowError();
  });

  it(`should sign bip84`, () => {
    const text = 'cHNidP8BAHECAAAAAbftTaU4oibD/kW4UuqG6VdPDn+AAddxfr1ORxs1In86AQAAAAD9////AqCGAQAAAAAAFgAU5oWAo35pGRpBve4vZuSf/RJ1l2usuIYAAAAAABYAFLob/Ay3/Fh09j461ZNq7kr9xDGDFD8lAAABAR/fP4gAAAAAABYAFMGTrvcmAlKD1XeIBJ2VhWvvXSIVAQD9FAICAAAAAAEDhx39Hm/Q+IEzeHzEIQR8hBFoWzQ7BgBNoq874UoXMI8AAAAAAP////+HEku25SJEM3C2XreROh/mAz9b3TV8pcEqT+zkrmDmbQAAAAAA/////yVr+qF09nHcVW8ARJTTnS0ZAzqBnSZjMBkGfl8wTKWOAQAAAAD/////AkBCDwAAAAAAIlEgD6fPGREBB8wuXHhOWjo7IPSS18oTbjir40WX7rJkP/vfP4gAAAAAABYAFMGTrvcmAlKD1XeIBJ2VhWvvXSIVAkgwRQIhAMsS8DNQhm1nKNVdL7owODpSrzeT2g08Jle8DzuMXEeBAiAHWR4cgpVAb+iHfMC9mpANFSNbjX0AjEdzZoC3kdygFAEhA2lmae3eHVT5DXJO+hSE/TOpI+5+D8qh1leRl5bL3O11AkcwRAIgdBOmAZuhELYvPJnbkRiCzGeYFgQ/MfoLNrsSVaSKeykCIDKQy+g6SeDBs6kJyXfVFlwXBFEpNcXmuA3lx6gDYTJUASECowQJtYhfXkPjBAHvC75lkFV5iSySYhty0FuAZMKtNksCSDBFAiEAua9he0HPwnRRYirYosDYyOjHYjcaEutLHeC0OYyk8S4CIChY/8DJ5nrodq3v6uLVnz/REsvPflTJ0ZFCdAtZWHy0ASECTmFJCY3OFzc/ljonlf5/eZVJQ5bfpheqaBJKdcswCnsAAAAAIgYDSAQOnCYCKWLs9oZ+yc+h54A6wej0RJ91nJU5HAuRAV0Yvc6JwFQAAIABAACAAAAAgAEAAAAKAAAAAAAiAgJgB8m777kJYRcdc9oPiSIpke67GbC33a2h9dntzSO/vhi9zonAVAAAgAEAAIAAAACAAQAAAAgAAAAA';
    const mnemonic = new Mnemonic();
    mnemonic.phrase = 'wool bullet crunch trend acoustic text swap flash video news bless second';
    const network = bitcoinjs.networks.testnet;
    const instance = Psbt.fromBase64(text, network);

    instance.sign(mnemonic);

    expect(instance.object.extractTransaction().toHex()).toEqual('02000000000101b7ed4da538a226c3fe45b852ea86e9574f0e7f8001d7717ebd4e471b35227f3a0100000000fdffffff02a086010000000000160014e68580a37e69191a41bdee2f66e49ffd1275976bacb8860000000000160014ba1bfc0cb7fc5874f63e3ad5936aee4afdc4318302483045022100cf27108fc4ad8743d74be54a04323b494f66374fea1540a94d091b9116a2918c02207eccab5daa7d456a795893e97fcb12c8ce1c405415f77af4afc53b372e57f8fa01210348040e9c26022962ecf6867ec9cfa1e7803ac1e8f4449f759c95391c0b91015d143f2500');
  });

  it(`should sign bip49`, () => {
    const text = 'cHNidP8BAHMCAAAAASVr+qF09nHcVW8ARJTTnS0ZAzqBnSZjMBkGfl8wTKWOAAAAAAD9////AtiFAQAAAAAAF6kUtnpJCJE5NQcm9kh8eaKq58pMplCHoIYBAAAAAAAXqRRnrgjC4pSlWUPXS8rWaXtm2Lxkf4cUPyUAAAEBIEANAwAAAAAAF6kUsyOJgC2az08Qlf4y5/qZgyWkmtyHAQDfAgAAAAABAQatW1ABGPWd1+SXnfjGsPLI2amGiyXOd2nQ1+3fJpWYAQAAAAD9////AkANAwAAAAAAF6kUsyOJgC2az08Qlf4y5/qZgyWkmtyH5NydAAAAAAAWABQmX8Ndbn5vUp5A83OmyWM+yvVd/QJHMEQCIAFN8jJafk/e028lTYFJ83ae8htx0C5kpSnAKJIvXsviAiA0PJPAOMoH6qzChT7OaJfhCg6is5MgfZ1Otfp/AunEfQEhAqG5afjYiXcTEeQvTaMrzg0biVO7iNpCaVbH8JuHo35yQjElAAEEFgAUnOkOGNUO8SMaoic6prWPyOqBo5wiBgKOK+8YrE9ria5xh/fokvDedZbj8nRDW4WBoWal9JWtGRi9zonAMQAAgAEAAIAAAACAAAAAAAAAAAAAAQAWABSj4FgqT3CQOQxWadTgITMlS45CcSICAyJ8jjwxBBgBTyESB63eate2Vzrp7DEDNIxN2HmKA32wGL3OicAxAACAAQAAgAAAAIABAAAAAAAAAAABABYAFO9wM4WfbqzViD0V5C9dLUq5OyqBIgICCok5y4p2NSM8CDdMClV7Kw+zTvwW+Y2hfXcRHTMLnh0Yvc6JwDEAAIABAACAAAAAgAAAAAABAAAAAA==';
    const mnemonic = new Mnemonic();
    mnemonic.phrase = 'wool bullet crunch trend acoustic text swap flash video news bless second';
    const network = bitcoinjs.networks.testnet;
    const instance = Psbt.fromBase64(text, network);

    instance.sign(mnemonic);

    expect(instance.object.extractTransaction().toHex()).toEqual('02000000000101256bfaa174f671dc556f004494d39d2d19033a819d26633019067e5f304ca58e00000000171600149ce90e18d50ef1231aa2273aa6b58fc8ea81a39cfdffffff02d88501000000000017a914b67a49089139350726f6487c79a2aae7ca4ca65087a08601000000000017a91467ae08c2e294a55943d74bcad6697b66d8bc647f87024830450221009bce44c8ddfdb4cc1d5fffee78f5b2de97184402831d4d4d082181e96ad5f80702207ac65c9c0339641bdfb6d1fcd898e559a8efc83d134f8e33942ea47272d25c530121028e2bef18ac4f6b89ae7187f7e892f0de7596e3f274435b8581a166a5f495ad19143f2500');
  });

});
