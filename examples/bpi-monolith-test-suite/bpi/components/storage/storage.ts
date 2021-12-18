import { Agreement } from "../../agreement";
import { IStorageComponent } from "./storage.interface";

export class StorageComponent implements IStorageComponent {
    agreement: Agreement;

    setInitialAgreementState(agreement: Agreement): void {
        this.agreement = agreement;
    }

    getAgreementState(): Agreement {
        return this.agreement;
    }
}