import { Component, OnInit } from '@angular/core';
import * as bitcoinjs from 'bitcoinjs-lib';
import { environment } from '../../environments/environment';

declare var M: any;

@Component({
    selector: 'app-side-navigation',
    templateUrl: './side-navigation.component.html',
    styleUrls: ['./side-navigation.component.css']
})
export class SideNavigationComponent implements OnInit {

    title: string;

    constructor() { }

    ngOnInit() {
        const elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems, {});
        const collapsibleElem = document.querySelector('.collapsible');
        M.Collapsible.init(collapsibleElem, {});
        this.title = 'Air gapped wallet';
        switch (environment.network) {
            case bitcoinjs.networks.testnet: this.title = this.title + ' (Testnet)'; break;
            case bitcoinjs.networks.regtest: this.title = this.title + ' (Regtest)'; break;
        }
    }

}
