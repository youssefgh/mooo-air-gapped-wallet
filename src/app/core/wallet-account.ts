
export class WalletAccount {

    index: number;
    name: string;
    lastUsedExternalP2wpkhIndex: number;
    lastUsedExternalP2wpkhInP2shIndex: number;
    lastUsedChangeP2wpkhIndex: number;
    lastUsedChangeP2wpkhInP2shIndex: number;

    lastUsedExternalIndex(purpose: number){
        let lastUsedExternalIndex;
        switch (purpose) {
            case 84:
                lastUsedExternalIndex = this.lastUsedExternalP2wpkhIndex;
                break;
            case 49:
                lastUsedExternalIndex = this.lastUsedExternalP2wpkhInP2shIndex;
                break;
        }
        return lastUsedExternalIndex;
    }

    updateLastUsedExternalIndex(newLastUsedExternalIndex: number, purpose: number){
        switch (purpose) {
            case 84:
                this.lastUsedExternalP2wpkhIndex = newLastUsedExternalIndex;
                break;
            case 49:
                this.lastUsedExternalP2wpkhInP2shIndex = newLastUsedExternalIndex;
                break;
        }
    }

    lastUsedChangeIndex(purpose: number){
        let lastUsedChangeIndex;
        switch (purpose) {
            case 84:
                lastUsedChangeIndex = this.lastUsedChangeP2wpkhIndex;
                break;
            case 49:
                lastUsedChangeIndex = this.lastUsedChangeP2wpkhInP2shIndex;
                break;
        }
        return lastUsedChangeIndex;
    }

    updateLastUsedChangeIndex(newLastUsedChangeIndex: number, purpose: number){
        switch (purpose) {
            case 84:
                this.lastUsedChangeP2wpkhIndex = newLastUsedChangeIndex;
                break;
            case 49:
                this.lastUsedChangeP2wpkhInP2shIndex = newLastUsedChangeIndex;
                break;
        }
    }

}
