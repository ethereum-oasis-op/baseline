import { Agreement } from "../../agreement";

export interface IStorageComponent {
    setInitialAgreementState(agreement: Agreement): void;
    getAgreementState(): Agreement;
}