*&---------------------------------------------------------------------*
*& Report zprvdvendorbankverify
*&---------------------------------------------------------------------*
*&
*&---------------------------------------------------------------------*
REPORT zprvdvendorbankverify.

PARAMETERS: p_vndr TYPE lifnr,
            p_cntry type lfbk-banks,
            p_tenant TYPE zprvdtenantid,
            p_sbjact TYPE zprvdtenantid,
            p_wrkgrp TYPE zprvdtenantid.

TYPES: BEGIN OF ty_vendorbank_proof,
         vendor_number  TYPE lfbk-lifnr,
         routing_number TYPE lfbk-bankl,
         account_number TYPE lfbk-bankn,
         country_key    type lfbk-banks,
         date           TYPE sy-datum,
         id             TYPE string,
       END OF ty_vendorbank_proof.

DATA: lv_setup_success     TYPE boolean,
      lv_status            TYPE i,
      lv_apiresponse       TYPE REF TO data,
      lv_apiresponsestr    TYPE string,
      ls_vendorbank_proof  TYPE ty_vendorbank_proof,
      ls_vendorbank_data   TYPE REF TO data,
      ls_protocol_msg_req  TYPE zif_prvd_baseline=>protocolmessage_req,
      ls_protocol_msg_resp TYPE zif_prvd_baseline=>protocolmessage_resp,
      lv_tenant            TYPE zprvdtenantid,
      lv_subj_acct         TYPE zprvdtenantid,
      lv_workgroup_id      TYPE zprvdtenantid,
      lo_prvd_api_helper   TYPE REF TO zcl_prvd_api_helper,
      wa_bpiobj    TYPE zbpiobj,
      lt_newbpis     TYPE TABLE OF zbpiobj,
      lv_timestamp type timestampl.

INITIALIZATION.

  GET PARAMETER ID 'ZPRVDTENANT' FIELD p_tenant.
  GET PARAMETER ID 'ZPRVDSUBJACCTID' FIELD p_sbjact.
  GET PARAMETER ID 'ZPRVDWRKGRPID' FIELD p_wrkgrp.

START-OF-SELECTION.

lv_tenant = p_tenant.
lv_subj_acct = p_sbjact.
lv_workgroup_id = p_wrkgrp.

SELECT SINGLE lifnr, bankl, bankn, banks FROM lfbk
    INTO @ls_vendorbank_proof
    WHERE lifnr = @p_vndr
      and banks = @p_cntry.
IF sy-subrc <> 0.
  "Indicate we have no data.
  ls_vendorbank_proof-vendor_number = p_vndr.
  ls_vendorbank_proof-routing_number = 0.
  ls_vendorbank_proof-account_number = 0.
ENDIF.
ls_vendorbank_proof-date = sy-datum.
ls_vendorbank_proof-id = ls_vendorbank_proof-vendor_number && '|' &&  ls_vendorbank_proof-country_key && '|' && sy-datum.

GET REFERENCE OF ls_vendorbank_proof INTO ls_vendorbank_data.


lo_prvd_api_helper = NEW zcl_prvd_api_helper( iv_tenant = lv_tenant iv_subject_acct_id = lv_subj_acct iv_workgroup_id = lv_workgroup_id ).

"request to /api/v1/protocol_messages
ls_protocol_msg_req-payload = ls_vendorbank_data.
ls_protocol_msg_req-type = 'SAPZKVendorBank'.


ls_protocol_msg_req-id = ls_vendorbank_proof-id .

lo_prvd_api_helper->setup_protocol_msg( IMPORTING setup_success = lv_setup_success ).

lo_prvd_api_helper->send_protocol_msg( EXPORTING is_body           = ls_protocol_msg_req
                                       IMPORTING ev_statuscode     = lv_status
                                                 ev_apiresponse    = lv_apiresponse
                                                 ev_apiresponsestr = lv_apiresponsestr  ).

IF lv_status = '202'.
  /ui2/cl_json=>deserialize( EXPORTING json = lv_apiresponsestr  CHANGING data = ls_protocol_msg_resp ).
  get time STAMP FIELD lv_timestamp.
  wa_bpiobj-baseline_id = ls_protocol_msg_resp-baseline_id.
  wa_bpiobj-proof = ls_protocol_msg_resp-proof.
  wa_bpiobj-object_id = ls_protocol_msg_req-id.
  wa_bpiobj-changed_by = sy-uname.
  wa_bpiobj-changed_at = lv_timestamp.
  wa_bpiobj-schematype = 'DDIC'.
  wa_bpiobj-schema_id = 'SAPZKVendorBank'.
  wa_bpiobj-workgroup_id = ls_protocol_msg_resp-workgroup_id.
  wa_bpiobj-subject_account_id = ls_protocol_msg_resp-subject_account_id.
  APPEND wa_bpiobj TO lt_newbpis.
  "create proof data entry
  zcl_prvd_busobjhlpr=>create_object( it_objects = lt_newbpis ).
ENDIF.
