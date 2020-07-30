<?xml version="1.0" encoding="UTF-8"?>
<!--

    Licensed under European Union Public Licence (EUPL) version 1.2.

-->
<!-- 

        	EDIFACT syntax binding to the EN16931   
        	Author: Andreas Pelekies
          Timestamp: 2016-10-31 00:00:00 +0200
 -->
<schema xmlns="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt2">
  <title>EN16931 model bound to EDIFACT</title>  
  <phase id="EN16931-model-phase">
    <active pattern="EN16931-EDIFACT-Model"/>
  </phase>
  <phase id="codelist_phase">
    <active pattern="EN16931-Codes"/>
  </phase>
  <phase id="syntax_phase">
    <active pattern="EN16931-EDIFACT-Syntax"/>
  </phase>
  <!-- Abstract CEN BII patterns -->
  <!-- ========================= -->
  <include href="abstract/EN16931-EDIFACT-model.sch"/>
  <include href="abstract/EN16931-EDIFACT-syntax.sch"/>
  <!-- Data Binding parameters -->
  <!-- ======================= -->
  <include href="EDIFACT/EN16931-EDIFACT-model.sch"/>
  <include href="EDIFACT/EN16931-EDIFACT-syntax.sch"/>
  <!-- Code Lists Binding rules -->
  <!-- ======================== -->
  <include href="codelist/EN16931-EDIFACT-codes.sch"/>
</schema>
