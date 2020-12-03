import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';
import { SessionStorageService } from '../shared/session-storage.service';

declare var M: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
        private router: Router,
    ) {
        if (!sessionStorageService.mnemonic) {
            if (!localStorageService.mnemonicPhrase) {
                this.router.navigateByUrl('createMnemonic');
                return;
            }
            this.router.navigateByUrl('initSession');
        }
    }
}
