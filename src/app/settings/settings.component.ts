import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../shared/local-storage.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {

    environment = environment;

    constructor(
        private localStorageService: LocalStorageService,
    ) {
    }

    get showBip49() {
        return this.localStorageService.showBip49;
    }

    @Input()
    set showBip49(showBip49: boolean) {
        this.localStorageService.showBip49 = showBip49;
        this.localStorageService.saveShowBip49();
    }

}
