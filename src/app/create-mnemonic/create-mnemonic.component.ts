import { AfterContentChecked, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../../environments/environment';
import { Mnemonic } from '../core/bitcoinjs/mnemonic';
import { LocalStorageService } from '../shared/local-storage.service';

declare var M: any;

@Component({
    selector: 'app-create-mnemonic',
    templateUrl: './create-mnemonic.component.html',
    styleUrls: ['./create-mnemonic.component.css'],
})
export class CreateMnemonicComponent implements AfterContentChecked {

    environment = environment;

    mnemonic: Mnemonic;

    twentyFourWordsStrength = 256;

    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
    ) {
        if (localStorageService.mnemonicPhrase) {
            this.router.navigateByUrl('home');
        }
    }

    newMnemonic() {
        this.mnemonic = new Mnemonic();
        this.mnemonic.phrase = Mnemonic.new(this.twentyFourWordsStrength).phrase;
    }

    save() {
        if (this.mnemonic.passphrase) {
            const mnemonicPassphraseHash = this.mnemonic.passphraseHash();
            this.localStorageService.saveMnemonicPassphraseHash(mnemonicPassphraseHash);
        }
        this.localStorageService.saveMnemonicPhrase(this.mnemonic.phrase);
        this.router.navigateByUrl('home');
    }

    ngAfterContentChecked() {
        M.updateTextFields();
        const elements = document.getElementsByClassName('materialize-textarea') as HTMLCollectionOf<HTMLElement>;
        // false postive
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            M.textareaAutoResize(element);
            let height = parseInt(element.style.height.replace('px', ''), 10);
            height = height + 2;
            element.style.height = height + 'px';
        }
    }
}
