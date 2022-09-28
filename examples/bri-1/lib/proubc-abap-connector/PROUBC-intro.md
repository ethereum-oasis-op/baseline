# proUBC
*An open source, SAP ABAP connector for PRVD Baseline aka BRI-1*

proUBC is an open source connector to make Baseline Protocol integration possible in SAP ABAP systems - such as S/4 HANA or SAP BTP ABAP Environment

A link to the proUBC repository is provided [here](https://github.com/provideplatform/proUBC.git)

This repository is maintained via abapGit. Instructions on how to clone, fork and maintain abapGit repositories such as this one can be found [here](https://docs.abapgit.org/)

Additional post-install, configuration, testing, and other instructions for using proUBC are provided in proUBC repository's README.

The scope of proUBC's present implementation of Baseline includes:
- Onboarding Baseline users via the proUBC REST component (invoked by Shuttle as a UX)
- Authenticating and linking DIDs/VCs used by BRI-1 to SAP Credentials via PRVD Ident component
- Initiating a Baseline Protocol message via the PRVD Baseline component

A sample integration was created using the batch program `ZPROUBC_SHUTTLEIDOC_EXMPL` to create protocol messages from SAP Purchase Orders.

The batch program takes a PRVD Ident Subject Account ID + Tenant ID as authentication input and prepares a Baseline Protocol message based on an a selected ORDERS05 or ORDERS02 iDoc from SAP. iDocs - for those less familiar - are a standard EDI message format used by SAP systems globally for purchase orders / sales orders.

At a future point in time - proUBC will be migrated to the [PRVD Oasis project](https://github.com/prvd-oasis) as it has since been added to the PRVD Oasis Charter
