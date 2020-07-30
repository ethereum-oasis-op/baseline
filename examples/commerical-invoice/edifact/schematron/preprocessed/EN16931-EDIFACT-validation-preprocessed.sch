<!--

    Licensed under European Union Public Licence (EUPL) version 1.2.

-->
<schema xmlns="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt2">
  <phase id="EN16931-model-phase">
    <active pattern="EN16931-EDIFACT-Model" />
  </phase>
  <phase id="codelist_phase">
    <active pattern="EN16931-Codes" />
  </phase>
  <phase id="syntax_phase">
    <active pattern="EN16931-EDIFACT-Syntax" />
  </phase>
  <pattern id="EN16931-EDIFACT-Model">
    <rule context="/M_INVOIC/G_SG26/S_RFF">
      <assert id="BR-52" flag="fatal" test="C_C506/D_1154">[BR-52]-Each additional supporting document shall
      contain a Supporting document reference. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG2[S_NAD/C_C082/D_3039='BY']/S_FII[D_3035='BI']">
      <assert id="BR-51" flag="fatal" test="((G_SG8[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461 = '49') and ((G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='AVS']/D_1154) or (G_SG2[S_NAD/D_3035='PE']/G_SG3/S_RFF/C_C506[D_1153='AVS']/D_1154))) or not(G_SG8[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461 =  '49')">[BR-51]-The last 4 to 6 digits of the Payment card
      primary account number shall be present if Payment card information is provided in the
      Invoice. </assert>
    </rule>
    <rule context="/M_INVOIC[G_SG8/S_PYT/D_4279='1' and G_SG8/S_PAI/C_C534/D_D4461=('30', '57')]/G_SG2[S_NAD/C_C082/D_3039='PE' or S_NAD/C_C082/D_3039='SE']/S_FII[D_3035='RB']">
      <assert id="BR-50" flag="fatal" test="C_C078/D_3194">[BR-50]-A Payment account identifier shall be
      present if Credit transfer information is provided in the Invoice. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']">
      <assert id="BR-31" flag="fatal" test="G_SG20/S_MOA/C_C516[D_5025='204']/D_5004">[BR-31]-Each document level allowance shall have a
      Document level allowance amount. </assert>
      <assert id="BR-32" flag="fatal" test="G_SG22/S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305">[BR-32]-Each document level allowance shall have a
      Document level allowance VAT category code. </assert>
      <assert id="BR-33" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C552/D_5189)">[BR-33]-Each document level allowance shall have a
      Document level allowance reason or a Document level allowance reason code. </assert>
      <assert id="BR-34" flag="fatal" test="G_SG20/S_MOA/C_C516[D_5025='204']/D_5004 >=0">[BR-34]-Document level allowance amounts shall not
      be negative. </assert>
      <assert id="BR-35" flag="fatal" test="(G_SG20/S_MOA/C_C516[D_5025='25']/D_5004 >=0) or not (G_SG20/S_MOA/C_C516[D_5025='25']/D_5004)">[BR-35]-Document level allowance base amount shall
      not be negative. </assert>
      <assert id="BR-CO-05" flag="fatal" test="true()">[BR-CO-05]-Document level allowance reason
      code and Document level allowance reason shall indicate the same type of allowance. </assert>
      <assert id="BR-CO-21" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C552/D_5189)">[BR-CO-21]-Each Document level allowance
      (BG-20) must contain a Document level allowance reason or a Document level allowance reason
      code, or both.</assert>
      <assert id="BR-DEC-01" flag="fatal" test="string-length(substring-after(G_SG20/S_MOA/C_C516[D_5025='204']/D_5004,'.'))&lt;=2">[BR-DEC-01]-The allowed maximum number of
      decimals for the Document level allowance amount (BT-92) is 2.</assert>
      <assert id="BR-DEC-02" flag="fatal" test="string-length(substring-after(G_SG20/S_MOA/C_C516[D_5025='25']/D_5004,'.'))&lt;=2">[BR-DEC-02]-The allowed maximum number of
      decimals for the Document level allowance base amount (BT-93) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']">
      <assert id="BR-36" flag="fatal" test="G_SG20/S_MOA/C_C516[D_5025='23']/D_5004">[BR-36]-Each document level charge shall have a
      Document level charge amount. </assert>
      <assert id="BR-37" flag="fatal" test="G_SG22/S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305">[BR-37]-Each document level charge shall have a
      Document level charge VAT category code. </assert>
      <assert id="BR-38" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C214/D_7161)">[BR-38]-Each document level charge shall have a
      Document level charge reason or a Document level charge reason code. </assert>
      <assert id="BR-40" flag="fatal" test="(G_SG20/S_MOA/C_C516[D_5025='25']/D_5004 >=0) or not (G_SG20/S_MOA/C_C516[D_5025='25']/D_5004)">[BR-40]-Document level charge base amounts shall
      not be negative. </assert>
      <assert id="BR-39" flag="fatal" test="G_SG20/S_MOA/C_C516[D_5025='23']/D_5004 >=0">[BR-39]-Document level charge amount shall not be
      negative. </assert>
      <assert id="BR-CO-06" flag="fatal" test="true()">[BR-CO-06]-Document level charge reason code
      and Document level charge reason shall indicate the same type of charge. </assert>
      <assert id="BR-CO-22" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C214/D_7161)">[BR-CO-22]-Each Document level charge
      (BG-21) must contain a Document level charge reason or a Document level charge reason code, or
      both.</assert>
      <assert id="BR-DEC-05" flag="fatal" test="string-length(substring-after(G_SG20/S_MOA/C_C516[D_5025='23']/D_5004,'.'))&lt;=2">[BR-DEC-05]-The allowed maximum number of
      decimals for the Document level charge amount (BT-92) is 2.</assert>
      <assert id="BR-DEC-06" flag="fatal" test="string-length(substring-after(G_SG20/S_MOA/C_C516[D_5025='25']/D_5004,'.'))&lt;=2">[BR-DEC-06]-The allowed maximum number of
      decimals for the Document level charge base amount (BT-93) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG52">
      <assert id="BR-DEC-09" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='79']/D_5004,'.'))&lt;=2">[BR-DEC-09]-The allowed maximum number of
      decimals for the Sum of Invoice line net amount (BT-106) is 2.</assert>
      <assert id="BR-DEC-10" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='260']/D_5004,'.'))&lt;=2">[BR-DEC-10]-The allowed maximum number of
      decimals for the Sum of allowanced on document level (BT-107) is 2.</assert>
      <assert id="BR-DEC-11" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='259']/D_5004,'.'))&lt;=2">[BR-DEC-11]-The allowed maximum number of
      decimals for the Sum of charges on document level (BT-108) is 2.</assert>
      <assert id="BR-DEC-12" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='389']/D_5004,'.'))&lt;=2">[BR-DEC-12]-The allowed maximum number of
      decimals for the Invoice total amount without VAT (BT-109) is 2.</assert>
      <assert id="BR-DEC-13" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='176']/D_5004,'.'))&lt;=2">[BR-DEC-13]-The allowed maximum number of
      decimals for the Invoice total VAT amount (BT-110) is 2.</assert>
      <assert id="BR-DEC-14" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='388']/D_5004,'.'))&lt;=2">[BR-DEC-14]-The allowed maximum number of
      decimals for the Invoice total amount with VAT (BT-112) is 2.</assert>
      <assert id="BR-DEC-15" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='2']/D_5004,'.'))&lt;=2">[BR-DEC-15]-The allowed maximum number of
      decimals for the Invoice total VAT amount in accounting currency (BT-111) is 2.</assert>
      <assert id="BR-DEC-16" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='113']/D_5004,'.'))&lt;=2">[BR-DEC-16]-The allowed maximum number of
      decimals for the Paid amount (BT-113) is 2.</assert>
      <assert id="BR-DEC-17" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='366']/D_5004,'.'))&lt;=2">[BR-DEC-17]-The allowed maximum number of
      decimals for the Rounding amount (BT-114) is 2.</assert>
      <assert id="BR-DEC-18" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='9']/D_5004,'.'))&lt;=2">[BR-DEC-18]-The allowed maximum number of
      decimals for the Amount due for payment (BT-115) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC">
      <assert id="BR-01" flag="fatal" test="S_FTX[D_4451='DOC']/C_C108/D_4440">[BR-01]-An Invoice shall have a Specification
      identification. </assert>
      <assert id="BR-02" flag="fatal" test="S_BGM/C_C106/D_1004">[BR-02]-An Invoice shall have an Invoice number. </assert>
      <assert id="BR-03" flag="fatal" test="S_DTM/C_C507[D_2005='137' and D_2379='102']/D_2380">[BR-03]-An Invoice shall have an Invoice issue
      date. </assert>
      <assert id="BR-04" flag="fatal" test="S_BGM/C_C002/D_1001">[BR-04]-An Invoice shall have an Invoice type
      code. </assert>
      <assert id="BR-05" flag="fatal" test="G_SG7/S_CUX/C_C504[D_6347='2']/D_6345">[BR-05]-An Invoice shall have an Invoice currency
      code. </assert>
      <assert id="BR-06" flag="fatal" test="G_SG2/S_NAD[D_3035='SE']/C_C080/D_3036">[BR-06]-An Invoice shall contain Seller name. </assert>
      <assert id="BR-07" flag="fatal" test="G_SG2/S_NAD[D_3035='BY']/C_C080/D_3036">[BR-07]-An Invoice shall contain Buyer name. </assert>
      <assert id="BR-08" flag="fatal" test="G_SG2/S_NAD[D_3035='SE']/D_3207">[BR-08]-An Invoice shall contain the Seller postal
      address. </assert>
      <assert id="BR-09" flag="fatal" test="G_SG2/S_NAD[D_3035='SE']/D_3207">[BR-09]-A Seller postal address shall contain a
      Seller country code. </assert>
      <assert id="BR-10" flag="fatal" test="G_SG2/S_NAD[D_3035='BY']/D_3207">[BR-10]-An Invoice shall contain the Buyer postal
      address. </assert>
      <assert id="BR-11" flag="fatal" test="G_SG2/S_NAD[D_3035='BY']/D_3207">[BR-11]-A Buyer postal address shall contain a
      Buyer country code. </assert>
      <assert id="BR-12" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='79']/D_5004">[BR-12]-An Invoice shall have the Sum of Invoice
      line net amount. </assert>
      <assert id="BR-13" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='389']/D_5004">[BR-13]-An Invoice shall have the Invoice total
      amount without VAT. </assert>
      <assert id="BR-14" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='388']/D_5004">[BR-14]-An Invoice shall have the Invoice total
      amount with VAT. </assert>
      <assert id="BR-15" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='9']/D_5004">[BR-15]-An Invoice shall have the Amount due for
      payment. </assert>
      <assert id="BR-16" flag="fatal" test="G_SG27/S_LIN">[BR-16]-An Invoice shall have at least one Invoice
      line. </assert>
      <assert id="BR-CO-01" flag="fatal" test="true()">[BR-CO-01]-Only one language shall be used
      in an Invoice: Invoice language code, if used, shall only occur once..</assert>
      <assert id="BR-CO-03" flag="fatal" test="((S_DTM[C_C507/D_2005='131']) and not (S_DTM[C_C507/D_2005='3'])) or (not (S_DTM[C_C507/D_2005='131']) and (S_DTM[C_C507/D_2005='3'])) or (not (S_DTM[C_C507/D_2005='131']) and not (S_DTM[C_C507/D_2005='3']))">[BR-CO-03]-Value added tax point date and
      Value added tax point date code are mutually exclusive. </assert>
      <assert id="BR-CO-10" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='79']/D_5004 = (round(sum(/M_INVOIC/G_SG27/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004) * 10 * 10)div 100)">[BR-CO-10]-Sum of Invoice line net amount =
      Σ Invoice line net amount. </assert>
      <assert id="BR-CO-11" flag="fatal" test="S_MOA/C_C516[D_5025='260']/D_5004 =      (     round(     sum(     /M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG20/S_MOA/C_C516[D_5025='389']/D_5004     )* 10 * 10      ) div 100     ) or      not(S_MOA/C_C516[D_5025='260']/D_5004)">[BR-CO-11]-Sum of allowances on document
      level = Σ Document level allowance amount. </assert>
      <assert id="BR-CO-12" flag="fatal" test="S_MOA/C_C516[D_5025='259']/D_5004 =      (     round(     sum(     /M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG20/S_MOA/C_C516[D_5025='389']/D_5004     )* 10 * 10      ) div 100     ) or      not(S_MOA/C_C516[D_5025='259']/D_5004)">[BR-CO-12]-Sum of charges on document level
      = Σ Document level charge amount. </assert>
      <assert id="BR-CO-13" flag="fatal" test="(G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='79']/D_5004 - G_SG52/S_MOA/C_C516[D_5025='260']/D_5004 + G_SG52/S_MOA/C_C516[D_5025='259']/D_5004) or      ((G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='79']/D_5004 - G_SG52/S_MOA/C_C516[D_5025='260']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='259']/D_5004)) or      ((G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='79']/D_5004 + G_SG52/S_MOA/C_C516[D_5025='259']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='260']/D_5004)) or      ((G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='79']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='259']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='260']/D_5004))">[BR-CO-13]-Invoice total amount without VAT
      = Σ Invoice line net amount - Sum of allowances on document level + Sum of charges on document
      level. </assert>
      <assert id="BR-CO-15" flag="fatal" test="(G_SG52/S_MOA/C_C516[D_5025='388']/D_5004 = round((G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 + G_SG52/S_MOA/C_C516[D_5025='176']/D_5004)*100) div 100) or      (G_SG52/S_MOA/C_C516[D_5025='388']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='389']/D_5004 and not (G_SG52/S_MOA/C_C516[D_5025='176']/D_5004))">[BR-CO-15]-Invoice total amount with VAT =
      Invoice total amount without VAT + Invoice total VAT amount. </assert>
      <assert id="BR-CO-16" flag="fatal" test="(G_SG52/S_MOA/C_C516[D_5025='9']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='388']/D_5004 - G_SG52/S_MOA/C_C516[D_5025='113']/D_5004 + G_SG52/S_MOA/C_C516[D_5025='366']/D_5004) or      ((G_SG52/S_MOA/C_C516[D_5025='9']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='388']/D_5004 + G_SG52/S_MOA/C_C516[D_5025='366']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='113']/D_5004)) or      ((G_SG52/S_MOA/C_C516[D_5025='9']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='388']/D_5004 - G_SG52/S_MOA/C_C516[D_5025='113']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='366']/D_5004)) or      ((G_SG52/S_MOA/C_C516[D_5025='9']/D_5004 = G_SG52/S_MOA/C_C516[D_5025='388']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='113']/D_5004) and not (G_SG52/S_MOA/C_C516[D_5025='366']/D_5004))">[BR-CO-16]-Amount due for payment = Invoice
      total amount with VAT-Paid amount + Rounding amount (BT-114). </assert>
      <assert id="BR-CO-18" flag="fatal" test="G_SG54">[BR-CO-18]-An invoice shall at least have
      one VAT breakdown group (BG-23). </assert>
      <assert id="BR-CO-25" flag="fatal" test="(number(G_SG52/S_MOA/C_C516[D_5025='9']/D_5004) > 0 and ((G_SG8[S_PYT/D_4279='1']/S_DTM/C_C507[D_2005='13']/D_2380) or (S_FTX[D_4451='AAB']/C_C108/D_4440))) or not(number(G_SG52/S_MOA/C_C516[D_5025='9']/D_5004)>0)">[BR-CO-25]-In case the Amount due for
      payment (BT-115) is positive, either the Payment due date (BT-9) or the Payment terms (BT-20)
      shall be present.</assert>
      <assert id="BR-S-01" flag="fatal" test="((count(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='S']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='S'])) >=2 or not (/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='S'])) and      ((count(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='S']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='S'])) >=2 or not (/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='S']))">[BR-S-01]-An Invoice that contains a line, a
      document level allowance or a document level charge where the Invoiced item VAT category code
      (BT-151, BT-95 or BT-102) is "Standard rated" shall contain in the VAT breakdown (BG-23) at
      least one VAT category code (BT-118) equal with "Standard rated". </assert>
      <assert id="BR-Z-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'Z']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'Z'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'Z']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'Z'])))">[BR-Z-01]-An Invoice that contains a line, a
      document level allowance or a document level charge where the Invoiced item VAT category code
      (BT-151, BT-95 or BT-102) is "Zero rated" shall contain in the VAT breakdown (BG-23) exactly
      one VAT category code (BT-118) equal with "Zero rated".</assert>
      <assert id="BR-E-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'E']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'E'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'E']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'E'])))">[BR-E-01]-An Invoice that contains a line, a
      document level allowance or a document level charge where the Invoiced item VAT category code
      (BT-151, BT-95 or BT-102) is "Exempt from VAT" shall contain in the VAT breakdown (BG-23)
      exactly one VAT category code (BT-118) equal with "Exempt from VAT".</assert>
      <assert id="BR-AE-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'AE']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'AE'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'AE']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'AE'])))">[BR-AE-01]-An Invoice that contains a line,
      a document level allowance or a document level charge where the Invoiced item VAT category
      code (BT-151, BT-95 or BT-102) is "VAT reverse charge" shall contain in the VAT breakdown
      (BG-23) exactly one VAT category code (BT-118) equal with "VAT reverse charge".</assert>
      <assert id="BR-IC-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'K']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'K'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'K']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'K'])))">[BR-IC-01]-An Invoice that contains a line,
      a document level allowance or a document level charge where the Invoiced item VAT category
      code (BT-151, BT-95 or BT-102) is "Intra-community supply" shall contain in the VAT breakdown
      (BG-23) exactly one VAT category code (BT-118) equal with "Intra-community supply".</assert>
      <assert id="BR-G-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'G']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'G'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'G']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'G'])))">[BR-G-01]-An Invoice that contains a line, a
      document level allowance or a document level charge where the Invoiced item VAT category code
      (BT-151, BT-95 or BT-102) is "Export outside the EU" shall contain in the VAT breakdown
      (BG-23) exactly one VAT category code (BT-118) equal with "Export outside the EU".</assert>
      <assert id="BR-O-01" flag="fatal" test="not(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'O']) or (      count(/M_INVOIC/G_SG54/S_TAX[D_5305 = 'O'])=1 and      (exists(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'O']) or     exists(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305 = 'O'])))">[BR-O-01]-An Invoice that contains a line, a
      document level allowance or a document level charge where the Invoiced item VAT category code
      (BT-151, BT-95 or BT-102) is "Not subject to VAT" shall contain in the VAT breakdown (BG-23)
      exactly one VAT category code (BT-118) equal with "Out of scope of VAT".</assert>
      <assert id="BR-AF-01" flag="fatal" test="((count(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='L']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='L'])) >=2 or not (/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='L'])) and      ((count(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='L']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='L'])) >=2 or not (/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='L']))">[BR-IG-01]-An Invoice that contains a line,
      a document level allowance or a document level charge where the Invoiced item VAT category
      code (BT-151, BT-95 or BT-102) is "IGIC" shall contain in the VAT breakdown (BG-23) at least
      one VAT category code (BT-118) equal with "IGIC". </assert>
      <assert id="BR-AG-01" flag="fatal" test="((count(/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='M']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='M'])) >=2 or not (/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305='M'])) and      ((count(/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='M']) + count(/M_INVOIC/G_SG54/S_TAX[D_5305='M'])) >=2 or not (/M_INVOIC/G_SG16/G_SG22/S_TAX[D_5305='M']))">[BR-IP-01]-An Invoice that contains a line,
      a document level allowance or a document level charge where the Invoiced item VAT category
      code (BT-151, BT-95 or BT-102) is "IPSI" shall contain in the VAT breakdown (BG-23) at least
      one VAT category code (BT-118) equal with "IPSI". </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27">
      <assert id="BR-21" flag="fatal" test="S_LIN/D_1082">[BR-21]-Each Invoice line shall have an Invoice
      line identifier. </assert>
      <assert id="BR-22" flag="fatal" test="S_QTY/C_C186[D_6063='47']/D_6060">[BR-22]-Each Invoice line shall have an Invoiced
      quantity. </assert>
      <assert id="BR-23" flag="fatal" test="S_QTY/C_C186[D_6063='47']/D_6411">[BR-23]-An invoiced quantity shall have an Invoice
      quantity unit of measure. </assert>
      <assert id="BR-24" flag="fatal" test="G_SG28/S_MOA/C_C516[D_5025='203']/D_5004">[BR-24]-Each Invoice line shall have an Invoice
      line net amount. </assert>
      <assert id="BR-25" flag="fatal" test="S_IMD[D_7077='F']/C_C273/D_7008">[BR-25]-Each Invoice line shall contain the Item
      name. </assert>
      <assert id="BR-26" flag="fatal" test="G_SG30/S_PRI/C_C509[D_5125='AAA']/D_5118">[BR-26]-Each Invoice line shall contain the Item
      net price. </assert>
      <assert id="BR-27" flag="fatal" test="(G_SG30/S_PRI/C_C509[D_5125='AAA']/D_5118) >= 0">[BR-27]-Invoice line item net price shall NOT be
      negative. </assert>
      <assert id="BR-28" flag="fatal" test="(G_SG30/S_PRI/C_C509[D_5125='AAB']/D_5118 >= 0) or not(G_SG30/S_PRI/C_C509[D_5125='AAB']/D_5118)">[BR-28]-Invoice line item gross price shall NOT be
      negative. </assert>
      <assert id="BR-CO-04" flag="fatal" test="G_SG35/S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305">[BR-CO-04]-Each Invoice line shall be
      categorized with an Invoiced item VAT category code. </assert>
      <assert id="BR-DEC-23" flag="fatal" test="string-length(substring-after(G_SG28/S_MOA/C_C516[D_5025='203']/D_5004,'.'))&lt;=2">[BR-DEC-23]-The allowed maximum number of
      decimals for the Invoice line net amount (BT-131) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/G_SG40[S_ALC/D_5463='A' and S_ALC/D_4471='2']">
      <assert id="BR-41" flag="fatal" test="G_SG43/S_MOA/C_C516[D_5025='204']/D_5004">[BR-41]-Each Invoice line allowance shall have an
      Invoice line allowance amount. </assert>
      <assert id="BR-42" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C552/D_5189)">[BR-42]-Each Invoice line allowance shall have an
      Invoice line allowance reason or an Invoice allowance reason code. </assert>
      <assert id="BR-CO-07" flag="fatal" test="true()">[BR-CO-07]-Invoice line allowance reason
      code and Invoice line allowance reason shall indicate the same type of allowance reason. </assert>
      <assert id="BR-CO-23" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C552/D_5189)">[BR-CO-23]-Each Invoice line allowance
      (BG-27) must contain a Invoice line allowance reason or a Invoice line allowance reason code,
      or both.</assert>
      <assert id="BR-DEC-24" flag="fatal" test="string-length(substring-after(G_SG43/S_MOA/C_C516[D_5025='204']/D_5004,'.'))&lt;=2">[BR-DEC-24]-The allowed maximum number of
      decimals for the Invoice line allowance amount (BT-136) is 2.</assert>
      <assert id="BR-DEC-25" flag="fatal" test="string-length(substring-after(G_SG43/S_MOA/C_C516[D_5025='25']/D_5004,'.'))&lt;=2">[BR-DEC-25]-The allowed maximum number of
      decimals for the Invoice line allowance base amount (BT-137) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/G_SG40[S_ALC/D_5463='C' and S_ALC/D_4471='2']">
      <assert id="BR-43" flag="fatal" test="G_SG43/S_MOA/C_C516[D_5025='23']/D_5004">[BR-43]-Each Invoice line charge shall have an
      Invoice line charge amount. </assert>
      <assert id="BR-44" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C214/D_7161)">[BR-44]-Each Invoice line charge shall have an
      Invoice line charge reason or an Invoice charge reason code. </assert>
      <assert id="BR-CO-08" flag="fatal" test="true()">[BR-CO-08]-Invoice line charge reason code
      and Invoice line charge reason shall indicate the same type of charge reason. </assert>
      <assert id="BR-CO-24" flag="fatal" test="(S_ALC/C_C552/D_1230) or (S_ALC/C_C214/D_7161)">[BR-CO-24]-Each Invoice line charge (BG-28)
      must contain a Invoice line charge reason or a Invoice line charge reason code, or
      both.</assert>
      <assert id="BR-DEC-27" flag="fatal" test="string-length(substring-after(G_SG43/S_MOA/C_C516[D_5025='23']/D_5004,'.'))&lt;=2">[BR-DEC-27]-The allowed maximum number of
      decimals for the Invoice line charge amount (BT-141) is 2.</assert>
      <assert id="BR-DEC-28" flag="fatal" test="string-length(substring-after(G_SG43/S_MOA/C_C516[D_5025='25']/D_5004,'.'))&lt;=2">[BR-DEC-28]-The allowed maximum number of
      decimals for the Invoice line charge base amount (BT-142) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/S_DTM/C_C507[D_2005 = ('167', '168')]">
      <assert id="BR-30" flag="fatal" test="(C_C507[D_2005='206' and D_2379='102']/D_2380) >= (C_C507[D_2005='194' and D_2379='102']/D_2380) or not (C_C507[D_2005='206']/D_2380) or not (C_C507[D_2005='194']/D_2380)">[BR-30]-If both Invoice line period start date and
      Invoice line period end date are given then the Invoice line period end date shall be later or
      equal to the Invoice line period start date.</assert>
      <assert id="BR-CO-20" flag="fatal" test="D_2380">[BR-CO-20]-If Invoice line period (BG-26) is
      used, the Invoice line period start date or the Invoice line period end date shall be filled,
      or both.</assert>
    </rule>
    <rule context="/M_INVOIC/S_DTM/C_C507[D_2005 = ('167', '168')]">
      <assert id="BR-29" flag="fatal" test="(C_C507[D_2005='168' and D_2379='102']/D_2380) >= (C_C507[D_2005='167' and D_2379='102']/D_2380) or not (C_C507[D_2005='168']/D_2380) or not (C_C507[D_2005='167']/D_2380)">[BR-29]-If both Delivery period start date and
      Delivery period end date are given then the Delivery period end date shall be later or equal
      to the Delivery period start date. </assert>
      <assert id="BR-CO-19" flag="fatal" test="D_2380">[BR-CO-19]-If Delivery or invoice period
      (BG-14) is used, the Delivery period start date or the Delivery period end date shall be
      filled, or both.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/S_FTX[D_4451='ACF' and D_4453='1']/C_C108">
      <assert id="BR-54" flag="fatal" test="(D_4440) and (D_4440_2)">[BR-54]-Each Item attribute shall contain an Item
      attribute name and an Item attribute value. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG2/S_NAD[D_3035='PE']">
      <assert id="BR-17" flag="fatal" test="(C_C080/D_3036) and (not(C_C080/D_3036 = ../../G_SG2/S_NAD[D_3035='SE']/C_C080/D_3036) or not(C_C082/D_3039 = ../../G_SG2/S_NAD[D_3035='SE']/C_C082/D_3039) or not(../G_SG3/S_RFF/C_C506[D_1153='APA']/D_1154 = ../../G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='APA']/D_1154))">[BR-17]-The Payee name shall be provided in the
      Invoice, if the Payee is different from the Seller. </assert>
    </rule>
    <rule context="/M_INVOIC">
      <assert id="BR-49" flag="fatal" test="G_SG8[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461">[BR-49]-A payment instruction shall specify the
      Payment means type code. </assert>
      <assert id="BR-CO-02" flag="fatal" test="((G_SG8[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461 = ('30','57')) and (G_SG2[S_NAD/C_C082/D_3039='PE' or S_NAD/C_C082/D_3039='SE']/S_FII[D_3035='RB']/C_C088/D_3434)) or not(G_SG8[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461 = ('30','57'))">[BR-CO-02]-Account identification shall be
      present if payment means is credit transfer. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG1/S_RFF/C_C506[D_1153='OI']">
      <assert id="BR-55" flag="fatal" test="D_1154">[BR-55]-Each Preceding invoice reference shall
      contain a preceding invoice number.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG2/S_NAD[D_3035='SE']">
      <assert id="BR-CO-26" flag="fatal" test="(C_C082/D_3039) or (../G_SG3/S_RFF/C_C506[D_1153 = 'GN']/D_1154) or (../G_SG3/S_RFF/C_C506[D_1153 = 'VA']/D_1154)">[BR-CO-26]-In order for the Buyer to
      automatically identify a supplier, either the Seller identifier (BT-29), the Seller legal
      registration identifier (BT-30) or the Seller VAT identifier (BT-31) shall be
      present.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG2/S_NAD[D_3035='AE']">
      <assert id="BR-18" flag="fatal" test="C_C080/D_3036">[BR-18]-The Seller tax representative name shall
      be provided in the Invoice, if the Seller has a tax representative party. </assert>
      <assert id="BR-19" flag="fatal" test="C_C059">[BR-19]-The Seller tax representative postal
      address shall be provided in the Invoice, if the Seller has a tax representative party. </assert>
      <assert id="BR-20" flag="fatal" test="D_3207">[BR-20]-The Seller tax representative postal
      address shall contain a Tax representative country code, if the Seller has a tax
      representative party. </assert>
    </rule>
    <rule context="/M_INVOIC[not(G_SG7/S_CUX/C_C504[D_6347='6']/D_6345 = G_SG7/S_CUX/C_C504[D_6347='2']/D_6345)]">
      <assert id="BR-53" flag="fatal" test="G_SG52/S_MOA/C_C516[D_5025='2']/D_5004">[BR-53]-If the VAT accounting currency code is
      different than the Invoice currency code, then the Invoice total VAT amount in accounting
      currency shall be provided. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_MOA/C_C516[D_5025='176']/D_5004">
      <assert id="BR-CO-14" flag="fatal" test=". =      (     round(     sum(     /M_INVOIC/G_SG54[S_TAX/D_5283='7' and S_TAX/C_C241/D_5153='VAT']/S_MOA/C_C516[D_5025='124']/D_5004     )*10*10     )div 100     )">[BR-CO-14]-Invoice total VAT amount = Σ VAT
      category tax amount. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54[S_TAX/D_5283='7' and S_TAX/C_C241/D_5153='VAT']">
      <assert id="BR-45" flag="fatal" test="S_MOA/C_C516[D_5025='125']/D_5004">[BR-45]-Each VAT breakdown shall have a VAT
      category taxable amount. </assert>
      <assert id="BR-46" flag="fatal" test="S_MOA/C_C516[D_5025='124']/D_5004">[BR-46]-Each VAT breakdown shall have a VAT
      category tax amount. </assert>
      <assert id="BR-47" flag="fatal" test="S_TAX/D_5305">[BR-47]-Each VAT breakdown shall be defined
      through a VAT category code. </assert>
      <assert id="BR-48" flag="fatal" test="(S_TAX/C_C243/D_5278) or (S_TAX/D_5305 = 'O')">[BR-48]-Each VAT breakdown shall have a VAT
      category rate, except if the Invoice is outside the scope of VAT. </assert>
      <assert id="BR-CO-17" flag="fatal" test="S_MOA/C_C516[D_5025='124']/D_5004 = round(S_MOA/C_C516[D_5025='125']/D_5004 * S_TAX[D_5283='VAT']/C_C243/D_5278) div 100 +0 or not (S_TAX[D_5283='VAT']/C_C243/D_5278)">[BR-CO-17]-VAT category tax amount = VAT
      category taxable amount x (VAT category rate / 100), rounded "half up" to two decimals. </assert>
      <assert id="BR-DEC-19" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='125']/D_5004,'.'))&lt;=2">[BR-DEC-19]-The allowed maximum number of
      decimals for the VAT category taxable amount (BT-116) is 2.</assert>
      <assert id="BR-DEC-20" flag="fatal" test="string-length(substring-after(S_MOA/C_C516[D_5025='124']/D_5004,'.'))&lt;=2">[BR-DEC-20]-The allowed maximum number of
      decimals for the VAT category tax amount (BT-117) is 2.</assert>
    </rule>
    <rule context="/M_INVOIC">
      <assert id="BR-CO-09" flag="fatal" test="true()">[BR-CO-09]-The Seller VAT identifier, Seller
      tax representative VAT identifier, Buyer VAT identifier shall have a prefix in accordance with
      ISO code ISO 3166-1 alpha-2 by which the Member State of issue may be identified.
      Nevertheless, Greece may use the prefix ‘EL’. </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'AE']">
      <assert id="BR-AE-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[                           G_SG35/S_TAX[                                         D_5283='7' and                                          C_C241/D_5153='VAT'                                                            ]                                       /D_5305='AE'                          ]                         /G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'AE'      ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'AE'      ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-AE-08]-In a VAT breakdown (BG-23) where
      VAT category code (BT-118) is "VAT reverse charge", the VAT category taxable amount (BT-116)
      shall equal the sum of Invoice line net amounts (BT-131) minus document level allowance
      amounts (BT-92) plus document level charge amounts (BT-99) where the VAT category code
      (BT-151, BT-102, BT-96) are "VAT reverse charge". </assert>
      <assert id="BR-AE-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-AE-09]-The VAT category tax amount
      (BT-117) in VAT breakdown (BG-23) where VAT category code (BT-118) is "VAT reverse charge"
      shall equal 0 (zero). </assert>
      <assert id="BR-AE-10" flag="fatal" test="(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) or (/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)">[BR-AE-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "VAT reverse charge" shall have a VAT exemption reason code (BT-121) or
      VAT exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5305='AE']">
      <assert id="BR-AE-03" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-AE-03]-An Invoice that contains a
      document level allowance where the Invoiced item VAT category code (BT-151) is "VAT reverse
      charge" shall contain the Sellers VAT identifier (BT-31), the Seller Tax registration
      identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) and the Buyer VAT
      identifier (BT-48). </assert>
      <assert id="BR-AE-06" flag="fatal" test="C_C243/D_5278 = 0">[BR-AE-06]-In a document level allowance
      where the Invoice item VAT category code (BT-95) is "VAT reverse charge" the Invoiced item VAT
      rate (BT-96) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5305='AE']">
      <assert id="BR-AE-04" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-AE-04]-An Invoice that contains a
      document level charge where the Invoiced item VAT category code (BT-151) is "VAT reverse
      charge" shall contain the Sellers VAT identifier (BT-31), the Seller Tax registration
      identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) and the Buyer VAT
      identifier (BT-48). </assert>
      <assert id="BR-AE-07" flag="fatal" test="C_C243/D_5278 = 0">[BR-AE-07]-In a document level charge where
      the Invoice item VAT category code (BT-102) is "VAT reverse charge" the Invoiced item VAT rate
      (BT-103) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'AE']">
      <assert id="BR-AE-02" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154)">[BR-AE-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "VAT reverse charge" shall contain the
      Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller
      tax representative VAT identifier (BT-63) and the Buyer VAT identifier or the Buyer tax
      registration identifier. </assert>
      <assert id="BR-AE-05" flag="fatal" test="C_C243/D_5278 = 0">[BR-AE-05]-In an Invoice line where the
      Invoice item VAT category code (BT-151) is "VAT reverse charge" the Invoiced item VAT rate
      (BT-152) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'L']">
      <assert id="BR-AF-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='L' and      G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'L' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'L' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-IG-08]-For each different value of VAT
      category rate (BT-119) where the VAT category code (BT-118) is "IGIC", the VAT category
      taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net
      amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of
      document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-96)
      is "IGIC" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119). </assert>
      <assert id="BR-AF-09" flag="fatal" test="true()">[BR-IG-09]-The VAT category tax amount
      (BT-117) in VAT breakdown (BG-23) where VAT category code (BT-118) is "IGIC" shall equal the
      VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119). </assert>
      <assert id="BR-AF-10" flag="fatal" test="(not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) and not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)) or (/M_INVOIC/G_SG54/S_TAX[D_5305=('AE','E','O','K','G')])">[BR-IG-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "IGIC" shall not have a VAT exemption reason code (BT-121) or VAT
      exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'L']">
      <assert id="BR-AF-02" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IG-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "IGIC" shall contain the Sellers VAT
      identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller tax
      representative VAT identifier (BT-63). </assert>
      <assert id="BR-AF-05" flag="fatal" test="C_C243/D_5278 > 0">[BR-IG-05]-In an Invoice line where the
      Invoice item VAT category code (BT-151) is "IGIC" the Invoiced item VAT rate (BT-152) shall be
      greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='L']">
      <assert id="BR-AF-03" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IG-03]-An Invoice that contains a
      document level allowance where the Invoiced item VAT category code (BT-151) is "IGIC" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-AF-06" flag="fatal" test="C_C243/D_5278 > 0">[BR-IG-06]-In a document level allowance
      where the Invoice item VAT category code (BT-95) is "IGIC" the Invoiced item VAT rate (BT-96)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='L']">
      <assert id="BR-AF-04" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IG-04]-An Invoice that contains a
      document level charge where the Invoiced item VAT category code (BT-151) is "IGIC" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-AF-07" flag="fatal" test="C_C243/D_5278 > 0">[BR-IG-07]-In a document level charge where
      the Invoice item VAT category code (BT-102) is "IGIC" the Invoiced item VAT rate (BT-103)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'M']">
      <assert id="BR-AG-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='M' and      G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'M' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'M' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-IP-08]-For each different value of VAT
      category rate (BT-119) where the VAT category code (BT-118) is "IPSI", the VAT category
      taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice line net
      amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum of
      document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102, BT-96)
      is "IPSI" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category rate (BT-119). </assert>
      <assert id="BR-AG-09" flag="fatal" test="true()">[BR-IP-09]-The VAT category tax amount
      (BT-117) in VAT breakdown (BG-23) where VAT category code (BT-118) is "IPSI" shall equal the
      VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119). </assert>
      <assert id="BR-AG-10" flag="fatal" test="(not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) and not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)) or(/M_INVOIC/G_SG54/S_TAX[D_5305=('AE','E','O','K','G')])">[BR-IP-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "IPSI" shall not have a VAT exemption reason code (BT-121) or VAT
      exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'M']">
      <assert id="BR-AG-02" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IP-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "IPSI" shall contain the Sellers VAT
      identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller tax
      representative VAT identifier (BT-63). </assert>
      <assert id="BR-AG-05" flag="fatal" test="C_C243/D_5278 > 0">[BR-IP-05]-In an Invoice line where the
      Invoice item VAT category code (BT-151) is "IPSI" the Invoiced item VAT rate (BT-152) shall be
      greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='M']">
      <assert id="BR-AG-03" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IP-03]-An Invoice that contains a
      document level allowance where the Invoiced item VAT category code (BT-151) is "IPSI" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-AG-06" flag="fatal" test="C_C243/D_5278 > 0">[BR-IP-06]-In a document level allowance
      where the Invoice item VAT category code (BT-95) is "IPSI" the Invoiced item VAT rate (BT-96)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='M']">
      <assert id="BR-AG-04" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-IP-04]-An Invoice that contains a
      document level charge where the Invoiced item VAT category code (BT-151) is "IGIC" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-AG-07" flag="fatal" test="C_C243/D_5278 > 0">[BR-IP-07]-In a document level charge where
      the Invoice item VAT category code (BT-102) is "IPSI" the Invoiced item VAT rate (BT-103)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'E']">
      <assert id="BR-E-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='E'      ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'E'      ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'E'      ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-E-08]-In a VAT breakdown (BG-23) where VAT
      category code (BT-118) is "Exempt from VAT", the VAT category taxable amount (BT-116) shall
      equal the sum of Invoice line net amounts (BT-131) minus document level allowance amounts
      (BT-92) plus document level charge amounts (BT-99) where the VAT category code (BT-151,
      BT-102, BT-96) are "Exempt from VAT". </assert>
      <assert id="BR-E-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-E-09]-The VAT category tax amount (BT-117)
      in VAT breakdown (BG-23) where VAT category code (BT-118) is "Exempt from VAT" shall equal 0
      (zero). </assert>
      <assert id="BR-E-10" flag="fatal" test="(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) or (/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)">[BR-E-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Exempt from VAT" shall have a VAT exemption reason code (BT-121) or
      VAT exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5305='E']">
      <assert id="BR-E-03" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-E-03]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Exempt from VAT" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-E-06" flag="fatal" test="C_C243/D_5278 = 0">[BR-E-06]-In a document level allowance where
      the Invoice item VAT category code (BT-95) is "Exempt from VAT" the Invoiced item VAT rate
      (BT-96) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5305='E']">
      <assert id="BR-E-04" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-E-04]-An Invoice that contains a document
      level charge where the Invoiced item VAT category code (BT-151) is "Exempt from VAT" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-E-07" flag="fatal" test="C_C243/D_5278 = 0">[BR-E-07]-In a document level charge where the
      Invoice item VAT category code (BT-102) is "Exempt from VAT" the Invoiced item VAT rate
      (BT-103) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'E']">
      <assert id="BR-E-02" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-E-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Exempt from VAT" shall contain the
      Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller
      tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-E-05" flag="fatal" test="C_C243/D_5278 = 0">[BR-E-05]-In an Invoice line where the Invoice
      item VAT category code (BT-151) is "Exempt from VAT" the Invoiced item VAT rate (BT-152) shall
      be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'G']">
      <assert id="BR-G-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='G'      ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'G'      ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'G'      ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-G-08]-In a VAT breakdown (BG-23) where VAT
      category code (BT-118) is "Export ouside the EU", the VAT category taxable amount (BT-116)
      shall equal the sum of Invoice line net amounts (BT-131) minus document level allowance
      amounts (BT-92) plus document level charge amounts (BT-99) where the VAT category code
      (BT-151, BT-102, BT-96) are "Export ouside the EU". </assert>
      <assert id="BR-G-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-G-09]-The VAT category tax amount (BT-117)
      in VAT breakdown (BG-23) where VAT category code (BT-118) is "Export ouside the EU" shall
      equal 0 (zero). </assert>
      <assert id="BR-G-10" flag="fatal" test="(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) or (/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)">[BR-G-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Export ouside the EU" shall have a VAT exemption reason code (BT-121)
      or VAT exemption reason text (BT-120). </assert>
      <assert id="BR-G-11" flag="fatal" test="(/M_INVOIC/S_DTM/C_C507[D_2005='35']/D_2380) or (/M_INVOIC/S_DTM/C_C507[D_2005='167']/D_2380) or (/M_INVOIC/S_DTM/C_C507[D_2005='168']/D_2380)">[BR-G-11]-In an Invoice with a VAT breakdown
      (BG-23) where the VAT category code (BT-118) is "Export ouside the EU" the actual delivery
      date (BT-72) or the delivery period (BG-14) shall not be blank.</assert>
      <assert id="BR-G-12" flag="fatal" test="/M_INVOIC/G_SG2/S_NAD[D_3035='DP']/D_3207">[BR-G-12]-In an Invoice with a VAT breakdown
      (BG-23) where the VAT category code (BT-118) is "Export ouside the EU" the deliver to country
      code (BT-80) shall not be blank.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5305='G']">
      <assert id="BR-G-03" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-G-03]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Export outside the EU"
      shall contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier
      (BT-32) or the Seller tax representative VAT identifier (BT-63) and the Buyer VAT identifier
      (BT-48). </assert>
      <assert id="BR-G-06" flag="fatal" test="C_C243/D_5278 = 0">[BR-G-06]-In a document level allowance where
      the Invoice item VAT category code (BT-95) is "Export outside the EU" the Invoiced item VAT
      rate (BT-96) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5305='G']">
      <assert id="BR-G-04" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-G-04]-An Invoice that contains a document
      level charge where the Invoiced item VAT category code (BT-151) is "Export outside the EU"
      shall contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier
      (BT-32) or the Seller tax representative VAT identifier (BT-63) and the Buyer VAT identifier
      (BT-48). </assert>
      <assert id="BR-G-07" flag="fatal" test="C_C243/D_5278 = 0">[BR-G-07]-In a document level charge where the
      Invoice item VAT category code (BT-102) is "Export outside the EU" the Invoiced item VAT rate
      (BT-103) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'G']">
      <assert id="BR-G-02" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-G-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Export outside the EU" shall contain
      the Sellers VAT identifier (BT-31) or the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-G-05" flag="fatal" test="C_C243/D_5278 = 0">[BR-G-05]-In an Invoice line where the Invoice
      item VAT category code (BT-151) is "Export outside the EU" the Invoiced item VAT rate (BT-152)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'K']">
      <assert id="BR-IC-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='K'      ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'K'      ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'K'      ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-IC-08]-In a VAT breakdown (BG-23) where
      VAT category code (BT-118) is "Intra-community suply", the VAT category taxable amount
      (BT-116) shall equal the sum of Invoice line net amounts (BT-131) minus document level
      allowance amounts (BT-92) plus document level charge amounts (BT-99) where the VAT category
      code (BT-151, BT-102, BT-96) are "Intra-community suply". </assert>
      <assert id="BR-IC-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-IC-09]-The VAT category tax amount
      (BT-117) in VAT breakdown (BG-23) where VAT category code (BT-118) is "Intra-community suply"
      shall equal 0 (zero). </assert>
      <assert id="BR-IC-10" flag="fatal" test="(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) or (/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)">[BR-IC-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Intra-community suply" shall have a VAT exemption reason code (BT-121)
      or VAT exemption reason text (BT-120). </assert>
      <assert id="BR-IC-11" flag="fatal" test="(/M_INVOIC/S_DTM/C_C507[D_2005='35']/D_2380) or (/M_INVOIC/S_DTM/C_C507[D_2005='167']/D_2380) or (/M_INVOIC/S_DTM/C_C507[D_2005='168']/D_2380)">[BR-IC-11]-In an Invoice with a VAT
      breakdown (BG-23) where the VAT category code (BT-118) is "Intra-community supply" the actual
      delivery date (BT-72) or the delivery period (BG-14) shall not be blank.</assert>
      <assert id="BR-IC-12" flag="fatal" test="/M_INVOIC/G_SG2/S_NAD[D_3035='DP']/D_3207">[BR-IC-12]-In an Invoice with a VAT
      breakdown (BG-23) where the VAT category code (BT-118) is "Intra-community supply" the deliver
      to country code (BT-80) shall not be blank.</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5305='K']">
      <assert id="BR-IC-03" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-IC-03]-An Invoice that contains a
      document level allowance where the Invoiced item VAT category code (BT-151) is
      "Intra-community supply" shall contain the Sellers VAT identifier (BT-31), the Seller Tax
      registration identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) and
      the Buyer VAT identifier (BT-48). </assert>
      <assert id="BR-IC-06" flag="fatal" test="C_C243/D_5278 = 0">[BR-IC-06]-In a document level allowance
      where the Invoice item VAT category code (BT-95) is "Intra-community supply" the Invoiced item
      VAT rate (BT-96) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5305='K']">
      <assert id="BR-IC-04" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-IC-04]-An Invoice that contains a
      document level charge where the Invoiced item VAT category code (BT-151) is "Intra-community
      supply" shall contain the Sellers VAT identifier (BT-31), the Seller Tax registration
      identifier (BT-32) or the Seller tax representative VAT identifier (BT-63) and the Buyer VAT
      identifier (BT-48). </assert>
      <assert id="BR-IC-07" flag="fatal" test="C_C243/D_5278 = 0">[BR-IC-07]-In a document level charge where
      the Invoice item VAT category code (BT-102) is "Intra-community supply" the Invoiced item VAT
      rate (BT-103) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'K']">
      <assert id="BR-IC-02" flag="fatal" test="(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and (/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-IC-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Intra-community supply" shall contain
      the Sellers VAT identifier (BT-31) or the Seller tax representative VAT identifier (BT-63) and
      the Buyer VAT identifier. </assert>
      <assert id="BR-IC-05" flag="fatal" test="C_C243/D_5278 = 0">[BR-IC-05]-In an Invoice line where the
      Invoice item VAT category code (BT-151) is "Intra-community supply" the Invoiced item VAT rate
      (BT-152) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'O']">
      <assert id="BR-O-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='O'     ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'O'     ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'O'     ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-O-08]-In a VAT breakdown (BG-23) where VAT
      category code (BT-118) is "Not subject to VAT", the VAT category taxable amount (BT-116) shall
      equal the sum of Invoice line net amounts (BT-131) minus document level allowance amounts
      (BT-92) plus document level charge amounts (BT-99) where the VAT category code (BT-151,
      BT-102, BT-96) are "Not subject to VAT". </assert>
      <assert id="BR-O-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-O-09]-The VAT category tax amount (BT-117)
      in VAT breakdown (BG-23) where VAT category code (BT-118) is "Not subject to VAT" shall equal
      0 (zero). </assert>
      <assert id="BR-O-10" flag="fatal" test="(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) or (/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)">[BR-O-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Not subject to VAT" shall have a VAT exemption reason code (BT-121),
      meaning "Not subject to VAT" or a VAT exemption reason text (BT-120) "Outside scope of VAT"
      (or the equivalent standard text in another language). </assert>
      <assert id="BR-O-11" flag="fatal" test="not(//S_TAX/D_5305 !='O')">[BR-O-11]-An Invoice that contains a VAT
      breakdown group (BG-23) with a VAT category code (BT-118) as "Not subject to VAT" shall not
      contain other VAT breakdown groups (BG-23).</assert>
      <assert id="BR-O-12" flag="fatal" test="not(//S_TAX/D_5305 !='O')">[BR-O-12]-An Invoice that contains a VAT
      breakdown group (BG-23) with a VAT category code (BT-118) as "Not subject to VAT" shall not
      contain lines where the Invoiced item VAT category code (BT-151) is not "Not subject to
      VAT".</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5305='O']">
      <assert id="BR-O-03" flag="fatal" test="not(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-O-03]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Not subject to VAT"
      shall not contain the Sellers VAT identifier (BT-31), the Seller tax representative VAT
      identifier (BT-63) or the Buyer VAT identifier (BT-48). </assert>
      <assert id="BR-O-06" flag="fatal" test="not(C_C243/D_5278)">[BR-O-06]-A document level allowance where VAT
      category code (BT-151) is "Not subject to VAT" shall not contain an invoiced item VAT rate
      (BT-152).</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5305='O']">
      <assert id="BR-O-04" flag="fatal" test="not(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-O-04]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Not subject to VAT"
      shall not contain the Sellers VAT identifier (BT-31), the Seller tax representative VAT
      identifier (BT-63) or the Buyer VAT identifier (BT-48). </assert>
      <assert id="BR-O-07" flag="fatal" test="not(C_C243/D_5278)">[BR-O-07]-A document level charge where VAT
      category code (BT-151) is "Not subject to VAT" shall not contain an invoiced item VAT rate
      (BT-152).</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27/G_SG35/S_TAX[D_5305 = 'O']">
      <assert id="BR-O-02" flag="fatal" test="not(/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154) and not(/M_INVOIC/G_SG2[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154)">[BR-O-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Not subject to VAT" shall not contain
      the Sellers VAT identifier (BT-31), the Seller tax representative VAT identifier (BT-63) or
      the Buyer VAT identifier. </assert>
      <assert id="BR-O-05" flag="fatal" test="not(C_C243/D_5278)">[BR-O-05]-In an Invoice line where VAT
      category code (BT-151) is "Not subject to VAT" shall not contain an invoiced item VAT rate
      (BT-152).</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'S']">
      <assert id="BR-S-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='S' and      G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'S' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'S' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/C_C243/D_5278 =      current()/C_C243/D_5278     ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-S-08]-For each different value of VAT
      category rate (BT-119) where the VAT category code (BT-118) is "Standard rated", the VAT
      category taxable amount (BT-116) in a VAT breakdown (BG-23) shall equal the sum of Invoice
      line net amounts (BT-131) plus the sum of document level charge amounts (BT-99) minus the sum
      of document level allowance amounts (BT-92) where the VAT category code (BT-151, BT-102,
      BT-96) is "Standard rated" and the VAT rate (BT-152, BT-103, BT-96) equals the VAT category
      rate (BT-119). </assert>
      <assert id="BR-S-09" flag="fatal" test="true()">[BR-S-09]-The VAT category tax amount (BT-117)
      in VAT breakdown (BG-23) where VAT category code (BT-118) is "Standard rated" shall equal the
      VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119). </assert>
      <assert id="BR-S-10" flag="fatal" test="(not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440) and not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441)) or (/M_INVOIC/G_SG54/S_TAX[D_5305=('AE','E','O','K','G')])">[BR-S-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Standard rated" shall not have a VAT exemption reason code (BT-121) or
      VAT exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'S']">
      <assert id="BR-S-02" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-S-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Standard rated" shall contain the
      Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller
      tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-S-05" flag="fatal" test="C_C243/D_5278 > 0">[BR-S-05]-In an Invoice line where the Invoice
      item VAT category code (BT-151) is "Standard rated" the Invoiced item VAT rate (BT-152) shall
      be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='S']">
      <assert id="BR-S-03" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-S-03]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Standard rated" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-S-06" flag="fatal" test="C_C243/D_5278 > 0">[BR-S-06]-In a document level allowance where
      the Invoice item VAT category code (BT-95) is "Standard rated" the Invoiced item VAT rate
      (BT-96) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='S']">
      <assert id="BR-S-04" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-S-04]-An Invoice that contains a document
      level charge where the Invoiced item VAT category code (BT-151) is "Standard rated" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-S-07" flag="fatal" test="C_C243/D_5278 > 0">[BR-S-07]-In a document level charge where the
      Invoice item VAT category code (BT-102) is "Standard rated" the Invoiced item VAT rate
      (BT-103) shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54/S_TAX[D_5283='7' and C_C241/D_5153='VAT' and D_5305 = 'Z']">
      <assert id="BR-Z-08" flag="fatal" test="../S_MOA/C_C516[D_5025='125']/D_5004 =      (     round(     sum(/M_INVOIC/G_SG27[     G_SG35/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305='Z'     ]/G_SG28/S_MOA/C_C516[D_5025='203']/D_5004      )     *10*10)     div 100     ) + (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='C' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'Z'     ]/G_SG20/S_MOA/C_C516[     D_5025='23'     ]/D_5004     )     *10*10)     div 100)      -      (     round(     sum(     /M_INVOIC/G_SG16[     S_ALC/D_5463='A' and     G_SG22/S_TAX[     D_5283='7' and      C_C241/D_5153='VAT'     ]/D_5305 = 'Z'     ]/G_SG20/S_MOA/C_C516[     D_5025='204'     ]/D_5004     )     *10*10)     div 100)">[BR-Z-08]-In a VAT breakdown (BG-23) where VAT
      category code (BT-118) is "Zero rated", the VAT category taxable amount (BT-116) shall equal
      the sum of Invoice line net amounts (BT-131) minus document level allowance amounts (BT-92)
      plus document level charge amounts (BT-99) where the VAT category code (BT-151, BT-102, BT-96)
      are "Zero rated". </assert>
      <assert id="BR-Z-09" flag="fatal" test="../S_MOA/C_C516[D_5025='124']/D_5004 = 0">[BR-Z-09]-The VAT category tax amount (BT-117)
      in VAT breakdown (BG-23) where VAT category code (BT-118) is "Zero rated" shall equal 0
      (zero). </assert>
      <assert id="BR-Z-10" flag="fatal" test="(not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C108/D_4440)                                    and not(/M_INVOIC/S_FTX[D_4451='AGM']/C_C107/D_4441))                                     or(/M_INVOIC/G_SG54/S_TAX[D_5305=('AE','E','O','K','G')])">[BR-Z-10]-A VAT Breakdown (BG-23) with VAT
      Category code (BT-118) "Zero rated" shall not have a VAT exemption reason code (BT-121) or VAT
      exemption reason text (BT-120). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='A']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='Z']">
      <assert id="BR-Z-03" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-Z-03]-An Invoice that contains a document
      level allowance where the Invoiced item VAT category code (BT-151) is "Zero rated" shall
      contain the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or
      the Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-Z-06" flag="fatal" test="C_C243/D_5278 = 0">[BR-Z-06]-In a document level allowance where
      the Invoice item VAT category code (BT-95) is "Zero rated" the Invoiced item VAT rate (BT-96)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16[S_ALC/D_5463='C']/G_SG22/S_TAX[D_5283='7' and C_C241/D5153='VAT' and D_5305='Z']">
      <assert id="BR-Z-04" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-Z-04]-An Invoice that contains a document
      level charge where the Invoiced item VAT category code (BT-151) is "Zero rated" shall contain
      the Sellers VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or the
      Seller tax representative VAT identifier (BT-63). </assert>
      <assert id="BR-Z-07" flag="fatal" test="C_C243/D_5278 = 0">[BR-Z-07]-In a document level charge where the
      Invoice item VAT category code (BT-102) is "Zero rated" the Invoiced item VAT rate (BT-103)
      shall be greater than 0 (zero). </assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27[G_SG35/S_TAX/D_5305 = 'Z']">
      <assert id="BR-Z-02" flag="fatal" test="/M_INVOIC/G_SG2[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('VA', 'FC')]/D_1154 or /M_INVOIC/G_SG2[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA']/D_1154">[BR-Z-02]-An Invoice that contains a line
      where the Invoiced item VAT category code (BT-151) is "Zero rated" shall contain the Sellers
      VAT identifier (BT-31), the Seller Tax registration identifier (BT-32) or the Seller tax
      representative VAT identifier (BT-63). </assert>
      <assert id="BR-Z-05" flag="fatal" test="C_C243/D_5278 = 0">[BR-Z-05]-In an Invoice line where the Invoice
      item VAT category code (BT-151) is "Zero rated" the Invoiced item VAT rate (BT-152) shall be
      greater than 0 (zero). </assert>
    </rule>
  </pattern>
  <pattern id="EN16931-EDIFACT-Syntax">
    <rule context="/M_INVOIC/S_UNH">
      <assert id="EDIFACT-SR-001" flag="warning" test="not(D_0068)">[EDIFACT-SR-001] - Common
            access reference should not be used</assert>
      <assert id="EDIFACT-SR-002" flag="warning" test="not(C_S010)">[EDIFACT-SR-002] - Status
            of the transfer should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/S_BGM">
      <assert id="EDIFACT-SR-003" flag="warning" test="not(C_C002/D_1131)">[EDIFACT-SR-003] - Code
            list identification code should not be used</assert>
      <assert id="EDIFACT-SR-004" flag="warning" test="not(C_C002/D_3055)">[EDIFACT-SR-004] - Code
            list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-005" flag="warning" test="not(C_C002/D_1000)">[EDIFACT-SR-005] -
            Document name should not be used</assert>
      <assert id="EDIFACT-SR-006" flag="warning" test="not(C_C106/D_1056)">[EDIFACT-SR-006] - Version
            identifier should not be used</assert>
      <assert id="EDIFACT-SR-007" flag="warning" test="not(C_C106/D_1060)">[EDIFACT-SR-007] -
            Revision identifier should not be used</assert>
      <assert id="EDIFACT-SR-008" flag="warning" test="not(D_1225)">[EDIFACT-SR-008] - Message
            function code should not be used</assert>
      <assert id="EDIFACT-SR-009" flag="warning" test="not(D_4343)">[EDIFACT-SR-009] -
            Response type code should not be used</assert>
      <assert id="EDIFACT-SR-010" flag="warning" test="not(D_1373)">[EDIFACT-SR-010] -
            Document status code should not be used</assert>
      <assert id="EDIFACT-SR-296" flag="warning" test="not(D_3453)">[EDIFACT-SR-296] -
            Language name code should not be used</assert>
    </rule>
    <rule context="/M_INVOIC">
      <assert id="EDIFACT-SR-011" flag="fatal" test="count(S_DTM/C_C507[D_2005='3' and not(D_2380)]) &lt;=1">[EDIFACT-SR-011] - The
            tax point code with invoice issue date may only be stated once</assert>
      <assert id="EDIFACT-SR-012" flag="warning" test="S_DTM/C_C507[D_2005='3' or D_2005='35' or D_2005='131' or D_2005='137' or D_2005='167' or D_2005='168' or D_2005='432']">[EDIFACT-SR-012] - Only
            values 3, 35, 131, 137, 167, 168 or 432 should be used</assert>
      <assert id="EDIFACT-SR-013" flag="fatal" test="count(S_DTM/C_C507[D_2005='35' and D_2380]) &lt;=1">[EDIFACT-SR-013] - The
            actual delivery date may only be stated once</assert>
      <assert id="EDIFACT-SR-014" flag="fatal" test="count(S_DTM/C_C507[D_2005='131']) &lt;=1">[EDIFACT-SR-014] - The value
            added tax point date may only be stated once</assert>
      <assert id="EDIFACT-SR-015" flag="fatal" test="count(S_DTM/C_C507[D_2005='137']) =1">[EDIFACT-SR-015] - The
            invoice issue date must be stated once</assert>
      <assert id="EDIFACT-SR-016" flag="fatal" test="count(S_DTM/C_C507[D_2005='167']) &lt;=1">[EDIFACT-SR-016] - The
            invoice period start date may only be stated once</assert>
      <assert id="EDIFACT-SR-017" flag="fatal" test="count(S_DTM/C_C507[D_2005='168']) &lt;=1">[EDIFACT-SR-017] - The
            invoice period end date may only be stated once</assert>
      <assert id="EDIFACT-SR-293" flag="fatal" test="count(S_DTM/C_C507[D_2005='432'] and not (D_2380)) &lt;=1">[EDIFACT-SR-293] - The
            tax point code with paid to date may only be stated once</assert>
      <assert id="EDIFACT-SR-294" flag="fatal" test="count(S_DTM/C_C507[D_2005='35' and not (D_2380)]) &lt;=1">[EDIFACT-SR-294] - The
            tax point code with actual delivery date may only be stated once</assert>
      <assert id="EDIFACT-SR-018" flag="warning" test="not(S_PAI)">[EDIFACT-SR-018] - The PAI
            segment should not be used</assert>
      <assert id="EDIFACT-SR-019" flag="warning" test="not(S_ALI)">[EDIFACT-SR-019] - The ALI
            segment should not be used</assert>
      <assert id="EDIFACT-SR-020" flag="warning" test="not(S_IMD)">[EDIFACT-SR-020] - The IMD
            segment should not be used</assert>
      <assert id="EDIFACT-SR-021" flag="warning" test="not(S_LOC)">[EDIFACT-SR-021] - The LOC
            segment should not be used</assert>
      <assert id="EDIFACT-SR-022" flag="warning" test="not(S_GEI)">[EDIFACT-SR-022] - The GEI
            segment should not be used</assert>
      <assert id="EDIFACT-SR-023" flag="warning" test="not(S_DGS)">[EDIFACT-SR-023] - The DGS
            segment should not be used</assert>
      <assert id="EDIFACT-SR-024" flag="warning" test="not(S_GIR)">[EDIFACT-SR-024] - The GIR
            segment should not be used</assert>
      <assert id="EDIFACT-SR-025" flag="warning" test="not(G_SG6)">[EDIFACT-SR-025] - The SG6
            segment group should not be used</assert>
      <assert id="EDIFACT-SR-026" flag="warning" test="not(G_SG9)">[EDIFACT-SR-026] - The SG9
            segment group should not be used</assert>
      <assert id="EDIFACT-SR-027" flag="warning" test="not(G_SG12)">[EDIFACT-SR-027] - The
            SG12 segment group should not be used</assert>
      <assert id="EDIFACT-SR-028" flag="warning" test="not(G_SG13)">[EDIFACT-SR-028] - The
            SG13 segment group should not be used</assert>
      <assert id="EDIFACT-SR-029" flag="warning" test="not(G_SG14)">[EDIFACT-SR-029] - The
            SG14 segment group should not be used</assert>
      <assert id="EDIFACT-SR-030" flag="warning" test="not(G_SG23)">[EDIFACT-SR-030] - The
            SG23 segment group should not be used</assert>
      <assert id="EDIFACT-SR-031" flag="warning" test="not(G_SG24)">[EDIFACT-SR-031] - The
            SG24 segment group should not be used</assert>
      <assert id="EDIFACT-SR-032" flag="warning" test="not(G_SG25)">[EDIFACT-SR-032] - The
            SG25 segment group should not be used</assert>
      <assert id="EDIFACT-SR-033" flag="warning" test="not(S_CNT)">[EDIFACT-SR-033] - The CNT
            segment should not be used</assert>
      <assert id="EDIFACT-SR-034" flag="warning" test="not(G_SG55)">[EDIFACT-SR-034] - The
            SG55 segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/S_FTX">
      <assert id="EDIFACT-SR-036" flag="warning" test="not(C_C107/D_1131)">[EDIFACT-SR-036] - Code
            list identification code should not be used</assert>
      <assert id="EDIFACT-SR-037" flag="warning" test="not(C_C107/D_3055)">[EDIFACT-SR-037] - Code
            list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-038" flag="warning" test="not(C_C108/D_4440_2 or C_C108/D_4440_3 or C_C108/D_4440_4 or C_C108/D_4440_5)">[EDIFACT-SR-038] -
            Additional free texts should not be used</assert>
      <assert id="EDIFACT-SR-039" flag="warning" test="not(D_3453)">[EDIFACT-SR-039] -
            Language name code should not be used</assert>
      <assert id="EDIFACT-SR-040" flag="warning" test="not(D_4447)">[EDIFACT-SR-040] - Free
            text format code should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG1">
      <assert id="EDIFACT-SR-041" flag="warning" test="(S_RFF/C_C506[D_1153='PQ' or D_1153='ATS' or D_1153='AAK' or D_1153='ALO' or D_1153='GC' or D_1153='VN' or D_1153='OI' or D_1153='ON' or D_1153='CT' or D_1153='AEP'])">[EDIFACT-SR-041] - Only
            values AAK, AEP, ALO, ATS, CT, GC, OI, ON, PQ or VN should be used</assert>
      <assert id="EDIFACT-SR-042" flag="warning" test="not(S_RFF/C_C506/D_1156)">[EDIFACT-SR-042] -
            Document line identifier should not be used</assert>
      <assert id="EDIFACT-SR-043" flag="warning" test="not(S_RFF/C_C506/D_1056)">[EDIFACT-SR-043] - Version
            identifier should not be used</assert>
      <assert id="EDIFACT-SR-044" flag="warning" test="not(S_RFF/C_C506/D_1060)">[EDIFACT-SR-044] -
            Revision identifier should not be used</assert>
      <assert id="EDIFACT-SR-045" flag="warning" test="count(S_RFF/C_C506[D_1153='GC']) &lt;=1">[EDIFACT-SR-045] - There
            should be maximal one tender or lot reference</assert>
      <assert id="EDIFACT-SR-046" flag="warning" test="count(S_RFF/C_C506[D_1153='DOC']) &lt;=1">[EDIFACT-SR-046] - There
            should be maximal one business process reference or specification identifier</assert>
      <assert id="EDIFACT-SR-048" flag="warning" test="count(S_RFF/C_C506[D_1153='CT']) &lt;=1">[EDIFACT-SR-048] - There
            should be maximal one contract reference</assert>
      <assert id="EDIFACT-SR-049" flag="warning" test="count(S_RFF/C_C506[D_1153='ON']) &lt;=1">[EDIFACT-SR-049] - There
            should be maximal one purchase order reference</assert>
      <assert id="EDIFACT-SR-050" flag="warning" test="count(S_RFF/C_C506[D_1153='VN']) &lt;=1">[EDIFACT-SR-050] - There
            should be maximal one sales order reference</assert>
      <assert id="EDIFACT-SR-051" flag="warning" test="count(S_RFF/C_C506[D_1153='ALO']) &lt;=1">[EDIFACT-SR-051] - There
            should be maximal one receiving advice reference</assert>
      <assert id="EDIFACT-SR-052" flag="warning" test="count(S_RFF/C_C506[D_1153='AAK']) &lt;=1">[EDIFACT-SR-052] - There
            should be maximal one despatch advice reference</assert>
      <assert id="EDIFACT-SR-053" flag="warning" test="count(S_RFF/C_C506[D_1153='ATS']) &lt;=1">[EDIFACT-SR-053] - There
            should be maximal one invoiced object reference</assert>
      <assert id="EDIFACT-SR-054" flag="warning" test="count(S_RFF/C_C506[D_1153='AEP']) &lt;=1">[EDIFACT-SR-054] - There
            should be maximal one project reference</assert>
      <assert id="EDIFACT-SR-055" flag="warning" test="(S_DTM/C_C507[D_2005='384']) or not (S_DTM)">[EDIFACT-SR-055] - A
            reference date should only be stated for a preceding invoice</assert>
      <assert id="EDIFACT-SR-056" flag="warning" test="not(S_DTM/C_C507/D_2379) or (S_RFF/C_C506/D_1153='OI')">[EDIFACT-SR-056] - Date or
            time or period format code should not be used</assert>
      <assert id="EDIFACT-SR-057" flag="warning" test="not(S_GIR) or (S_RFF/C_C506[D_1153='ATS'] and S_GIR[D_7297='14'])">[EDIFACT-SR-057] - The
            segment GIR should not be used</assert>
      <assert id="EDIFACT-SR-295" flag="warning" test="not(S_GIR/C_C206/D_7405) and not (S_GIR/C_C206/D_4405) and not (S_GIR/C_C206_2) and not (S_GIR/C_C206_3) and not (S_GIR/C_C206_4) and not (S_GIR/C_C206_5)">[EDIFACT-SR-295] - Only one Object identifier may be stated in the GIR segment.</assert>
      <assert id="EDIFACT-SR-058" flag="warning" test="not(S_LOC)">[EDIFACT-SR-058] - The
            segment LOC should not be used</assert>
      <assert id="EDIFACT-SR-059" flag="warning" test="not(S_MEA)">[EDIFACT-SR-059] - The
            segment MEA should not be used</assert>
      <assert id="EDIFACT-SR-060" flag="warning" test="not(S_QTY)">[EDIFACT-SR-060] - The
            segment QTY should not be used</assert>
      <assert id="EDIFACT-SR-061" flag="warning" test="not(S_FTX)">[EDIFACT-SR-061] - The
            segment FTX should not be used</assert>
      <assert id="EDIFACT-SR-062" flag="warning" test="not(S_MOA)">[EDIFACT-SR-062] - The
            segment MOA should not be used</assert>
      <assert id="EDIFACT-SR-063" flag="warning" test="not(S_RTE)">[EDIFACT-SR-063] - The
            segment RTE should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG2">
      <assert id="EDIFACT-SR-064" flag="warning" test="S_NAD[D_3035='SE' or D_3035='BY' or D_3035='PE' or D_3035='LC' or D_3035='DP']">[EDIFACT-SR-064] - Only
            values SE, BY, PE, LC or DP should be used</assert>
      <assert id="EDIFACT-SR-065" flag="warning" test="not(S_NAD/C_C082/D_3055)">[EDIFACT-SR-065] - Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-067" flag="warning" test="not(S_NAD/C_C058)">[EDIFACT-SR-067] - Name
            and address composit should not be used</assert>
      <assert id="EDIFACT-SR-068" flag="warning" test="not(S_NAD[D_3035='LC']/C_C082)">[EDIFACT-SR-068] - Party
            identification should not be used for a seller's tax representative</assert>
      <assert id="EDIFACT-SR-069" flag="warning" test="not(S_NAD/C_C080/D_3036_2) or (S_NAD/D_3035=('BY', 'SE'))">[EDIFACT-SR-069] - The
            second party name should only be used for a seller or a buyer</assert>
      <assert id="EDIFACT-SR-070" flag="warning" test="not(S_NAD/C_C080/D_3036_3 or S_NAD/C_C080/D_3036_4 or S_NAD/C_C080/D_3036_5)">[EDIFACT-SR-070] -
            Additional party name should not be used</assert>
      <assert id="EDIFACT-SR-071" flag="warning" test="not(S_NAD/C_C080/D_3045)">[EDIFACT-SR-071] - Party
            name format code should not be used</assert>
      <assert id="EDIFACT-SR-072" flag="warning" test="not(S_NAD[D_3035='PE']/C_C059)">[EDIFACT-SR-072] - Street
            should not be used in payee</assert>
      <assert id="EDIFACT-SR-074" flag="warning" test="not(S_NAD/C_C059/D_3042_4)">[EDIFACT-SR-074] - Street
            line 4 should not be used</assert>
      <assert id="EDIFACT-SR-075" flag="warning" test="not(S_NAD[D_3035='PE']/D_3164)">[EDIFACT-SR-075] - City
            name should not be used</assert>
      <assert id="EDIFACT-SR-076" flag="warning" test="not(S_NAD/C_C819/D_3229)">[EDIFACT-SR-076] - Country
            subdivision identifier should not be used</assert>
      <assert id="EDIFACT-SR-077" flag="warning" test="not(S_NAD/C_C819/D_1131)">[EDIFACT-SR-077] - Code
            list identification code should not be used</assert>
      <assert id="EDIFACT-SR-078" flag="warning" test="not(S_NAD/C_C819/D_3055)">[EDIFACT-SR-078] - Code
            list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-079" flag="warning" test="not(S_NAD[D_3035='PE']/C_C819/D_3228)">[EDIFACT-SR-079] - Country
            subdivision name should not be used</assert>
      <assert id="EDIFACT-SR-080" flag="warning" test="not(S_NAD[D_3035='PE']/D_3251)">[EDIFACT-SR-080] - Postal
            identification code should not be used</assert>
      <assert id="EDIFACT-SR-081" flag="warning" test="not(S_NAD[D_3035='PE']/D_3207)">[EDIFACT-SR-081] - Country
            identifier should not be used</assert>
      <assert id="EDIFACT-SR-082" flag="warning" test="not(S_LOC)">[EDIFACT-SR-082] - The LOC
            should not be used</assert>
      <assert id="EDIFACT-SR-083" flag="warning" test="(.[S_NAD/D_3035=('SE', 'PE')]/S_FII[D_3035='RB'])    or (.[S_NAD/D_3035='BY']/S_FII[D_3035=('PB', 'BI')]) or not (./S_FII)">[EDIFACT-SR-083] - The FII
            segment should only be used for seller, buyer and payee</assert>
      <assert id="EDIFACT-SR-084" flag="warning" test="not(S_FII/C_C088/D_1131)">[EDIFACT-SR-084] - The
            code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-085" flag="warning" test="not(S_FII/C_C088/D_1131_2)">[EDIFACT-SR-085] - The
            code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-086" flag="warning" test="not(S_FII/C_C088/D_3055_2)">[EDIFACT-SR-086] - The
            code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-087" flag="warning" test="not(S_FII/C_C088/D_3432)">[EDIFACT-SR-087] - The
            institution name should not be used</assert>
      <assert id="EDIFACT-SR-088" flag="warning" test="not(S_FII/C_C088/D_3436)">[EDIFACT-SR-088] - The
            institution branch location name should not be used</assert>
      <assert id="EDIFACT-SR-089" flag="warning" test="not(S_FII/D_3207)">[EDIFACT-SR-089] - The
            country identifier should not be used</assert>
      <assert id="EDIFACT-SR-090" flag="warning" test="S_FII[D_3035=('RB','PB')]/C_C078/D_3192 or not (S_FII/C_C078/D_3192)">[EDIFACT-SR-090] - The
            account holder name should only be used for payment cards or credit transfer</assert>
      <assert id="EDIFACT-SR-091" flag="warning" test="not(S_MOA)">[EDIFACT-SR-091] - The MOA
            segment should not be used</assert>
      <assert id="EDIFACT-SR-092" flag="warning" test="not(G_SG3/S_DTM)">[EDIFACT-SR-092] - The DTM
            segment should not be used</assert>
      <assert id="EDIFACT-SR-093" flag="warning" test="not(G_SG3/S_RFF/C_C506/D_1156)">[EDIFACT-SR-093] - The
            document line identifier should not be used</assert>
      <assert id="EDIFACT-SR-094" flag="warning" test="not(G_SG3/S_RFF/C_C506/D_1056)">[EDIFACT-SR-093] - The
            version identifier should not be used</assert>
      <assert id="EDIFACT-SR-095" flag="warning" test="not(G_SG3/S_RFF/C_C506/D_1060)">[EDIFACT-SR-093] - The
            revision identifier should not be used</assert>
      <assert id="EDIFACT-SR-096" flag="warning" test="not(G_SG3/S_RFF) or        (.[S_NAD/D_3035='SE']/G_SG3/S_RFF/C_C506[D_1153=('GN', 'VA', 'AHP')]) or       (.[S_NAD/D_3035='BY']/G_SG3/S_RFF/C_C506[D_1153=('GN', 'AOU', 'CR', 'VA', 'AVS', 'AII')]) or       (.[S_NAD/D_3035='PE']/G_SG3/S_RFF/C_C506[D_1153='GN']) or       (.[S_NAD/D_3035='LC']/G_SG3/S_RFF/C_C506[D_1153='VA'])">[EDIFACT-SR-096] - The
            used reference code qualified should not be used</assert>
      <assert id="EDIFACT-SR-097" flag="warning" test="not(G_SG4)">[EDIFACT-SR-097] - The SG4
            segment group should not be used</assert>
      <assert id="EDIFACT-SR-098" flag="warning" test="not(G_SG5[S_CTA/D_3139='IC']) or G_SG5[S_CTA/D_3139='IC']/S_COM/C_C076/D_3148">[EDIFACT-SR-098] - The
            seller electronic address has to be given in a defined structure</assert>
      <assert id="EDIFACT-SR-099" flag="warning" test="not(G_SG5/S_CTA/C_C056/D_3413)">[EDIFACT-SR-099] - The
            contact identifer should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG7">
      <assert id="EDIFACT-SR-100" flag="warning" test="(S_CUX/C_C504/D_6347=('2', '6'))">[EDIFACT-SR-100] - Only
            the invoice currency or the VAT accounting currency should be used</assert>
      <assert id="EDIFACT-SR-101" flag="warning" test="not (S_CUX/C_C504/D_6348)">[EDIFACT-SR-101] - The
            Currency rate should not be used</assert>
      <assert id="EDIFACT-SR-102" flag="warning" test="not (S_CUX/C_C504_2)">[EDIFACT-SR-102] - The
            second composite of C504 should not be used</assert>
      <assert id="EDIFACT-SR-103" flag="warning" test="not (S_CUX/D_5402)">[EDIFACT-SR-103] - The
            Currency exchange rate should not be used</assert>
      <assert id="EDIFACT-SR-104" flag="warning" test="not (S_CUX/D_6341)">[EDIFACT-SR-104] - The
            Exchange rate currency market identifier should not be used</assert>
      <assert id="EDIFACT-SR-105" flag="warning" test="not (S_DTM)">[EDIFACT-SR-105] - The
            DTM segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG8">
      <assert id="EDIFACT-SR-106" flag="warning" test="(.[S_PYT/D_4279='1']/S_PAI/C_C534/D_4461 or .[S_PYT/D_4279='1']/S_DTM/C_C507[D_2005='13' and D_2379='102']/D_2380 or not(S_PAI))   or (.[S_PYT/D_4279='1']/S_PAI/D_4461 and not (S_DTM))">[EDIFACT-SR-106] - Only
            the payment due date or the payment means code should be given in SG8.</assert>
      <assert id="EDIFACT-SR-107" flag="warning" test="not (S_PYT/C_C019)">[EDIFACT-SR-107] - The
            C019 composite should not be used</assert>
      <assert id="EDIFACT-SR-108" flag="warning" test="not (S_PYT/D_2151)">[EDIFACT-SR-108] - The
            Period type code should not be used</assert>
      <assert id="EDIFACT-SR-109" flag="warning" test="not (S_PYT/D_2152)">[EDIFACT-SR-109] - The
            Period count quantity should not be used</assert>
      <assert id="EDIFACT-SR-110" flag="warning" test="not (S_PCD)">[EDIFACT-SR-110] - The
            PCD segment group should not be used</assert>
      <assert id="EDIFACT-SR-111" flag="warning" test="not (S_MOA)">[EDIFACT-SR-111] - The
            MOA segment group should not be used</assert>
      <assert id="EDIFACT-SR-112" flag="warning" test="not (S_FII)">[EDIFACT-SR-112] - The
            FII segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG16">
      <assert id="EDIFACT-SR-113" flag="warning" test="S_ALC/D_5463=('A', 'C')">[EDIFACT-SR-113] - Only codes 'A' or 'C' should be used</assert>
      <assert id="EDIFACT-SR-114" flag="warning" test="not(S_ALC/D_4471)">[EDIFACT-SR-114] - The
            Settlement means code should not be used</assert>
      <assert id="EDIFACT-SR-115" flag="warning" test="not(S_ALC/D_1227)">[EDIFACT-SR-115] - The
            Calculation sequence code should not be used</assert>
      <assert id="EDIFACT-SR-116" flag="warning" test="not(S_ALC/C_C214) or (S_ALC/D_5463='C')">[EDIFACT-SR-116] - The
            Special services group should not be used</assert>
      <assert id="EDIFACT-SR-117" flag="warning" test="not(S_ALI)">[EDIFACT-SR-117] - The
            ALI group should not be used</assert>
      <assert id="EDIFACT-SR-118" flag="warning" test="not(S_FTX)">[EDIFACT-SR-118] - The            
            FTX group should not be used</assert>
      <assert id="EDIFACT-SR-119" flag="warning" test="not(G_SG17)">[EDIFACT-SR-119] - The            
            SG17 group should not be used</assert>
      <assert id="EDIFACT-SR-120" flag="warning" test="not(G_SG18)">[EDIFACT-SR-120] - The            
            SG18 group should not be used</assert>
      <assert id="EDIFACT-SR-121" flag="warning" test="G_SG19/S_PCD/C_C501[D_5245=('1','2')]/D_5482 or not (G_SG19)">[EDIFACT-SR-121] - Only codes '1' or '2' are valid to identify document level allowances or charges</assert>
      <assert id="EDIFACT-SR-122" flag="warning" test="not(G_SG19/S_PCD/C_C501/D_5249)">[EDIFACT-SR-122] - The Percentage basis identification code should not be used</assert>
      <assert id="EDIFACT-SR-123" flag="warning" test="not(G_SG19/S_PCD/C_C501/D_1131)">[EDIFACT-SR-123] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-124" flag="warning" test="not(G_SG19/S_PCD/C_C501/D_3055)">[EDIFACT-SR-124] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-125" flag="warning" test="not(G_SG19/S_PCD/D_4055)">[EDIFACT-SR-125] - The Status description code should not be used</assert>
      <assert id="EDIFACT-SR-126" flag="warning" test="not(G_SG19/S_RNG)">[EDIFACT-SR-126] - The RNG segment group should not be used</assert>
      <assert id="EDIFACT-SR-127" flag="warning" test="G_SG20/S_MOA/C_C516[D_5025 = ('23', '25', '204')]/D_5004">[EDIFACT-SR-127] - Only document level charge amount, document level charge basis amount, document level allowance amount or document level allowance basis amount should be stated</assert>
      <assert id="EDIFACT-SR-128" flag="warning" test="not(G_SG20/S_MOA/C_C516/D_6345)">[EDIFACT-SR-128] - The Currency identification code should not be used</assert>
      <assert id="EDIFACT-SR-129" flag="warning" test="not(G_SG20/S_MOA/C_C516/D_6343)">[EDIFACT-SR-129] - The Currency type code qualifier should not be used</assert>
      <assert id="EDIFACT-SR-130" flag="warning" test="not(G_SG20/S_MOA/C_C516/D_4405)">[EDIFACT-SR-130] - The Status desciption should not be used</assert>
      <assert id="EDIFACT-SR-131" flag="warning" test="not(G_SG20/S_RNG)">[EDIFACT-SR-131] - The RNG segment group should not be used</assert>
      <assert id="EDIFACT-SR-132" flag="warning" test="not(G_SG20/S_CUX)">[EDIFACT-SR-132] - The CUX segment group should not be used</assert>
      <assert id="EDIFACT-SR-133" flag="warning" test="not(G_SG20/S_DTM)">[EDIFACT-SR-133] - The DTM segment group should not be used</assert>
      <assert id="EDIFACT-SR-134" flag="warning" test="not(G_SG21)">[EDIFACT-SR-134] - The SG21 segment group should not be used</assert>
      <assert id="EDIFACT-SR-135" flag="warning" test="G_SG22/S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305">[EDIFACT-SR-135] - The allowance or charge VAT category code should be stated</assert>
      <assert id="EDIFACT-SR-136" flag="warning" test="not(G_SG22/S_TAX/C_C241/D_1131)">[EDIFACT-SR-136] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-137" flag="warning" test="not(G_SG22/S_TAX/C_C241/D_3055)">[EDIFACT-SR-137] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-138" flag="warning" test="not(G_SG22/S_TAX/C_C241/D_5152)">[EDIFACT-SR-138] - The Duty or tax or fee type code should not be used</assert>
      <assert id="EDIFACT-SR-139" flag="warning" test="not(G_SG22/S_TAX/C_C533)">[EDIFACT-SR-139] - The C533 composite should not be used</assert>
      <assert id="EDIFACT-SR-140" flag="warning" test="not(G_SG22/S_TAX/D_5286)">[EDIFACT-SR-140] - The Duty or tax or fee assessment basis quantity should not be used</assert>
      <assert id="EDIFACT-SR-141" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_5279)">[EDIFACT-SR-141] - The Duty or tax or fee rate code should not be used</assert>
      <assert id="EDIFACT-SR-142" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_1131)">[EDIFACT-SR-142] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-143" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_3055)">[EDIFACT-SR-143] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-144" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_5273)">[EDIFACT-SR-144] - The Duty or tax or fee rate basis code should not be used</assert>
      <assert id="EDIFACT-SR-145" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_1131_2)">[EDIFACT-SR-145] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-146" flag="warning" test="not(G_SG22/S_TAX/C_C243/D_3055_2)">[EDIFACT-SR-146] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-147" flag="warning" test="not(G_SG22/S_TAX/D_3446)">[EDIFACT-SR-147] - The Party tax identifier should not be used</assert>
      <assert id="EDIFACT-SR-148" flag="warning" test="not(G_SG22/S_TAX/D_1227)">[EDIFACT-SR-148] - The Calculation sequence code should not be used</assert>
      <assert id="EDIFACT-SR-149" flag="warning" test="not(G_SG22/S_TAX/D_5307)">[EDIFACT-SR-149] - The Tax or duty or fee payment due date code should not be used</assert>
      <assert id="EDIFACT-SR-150" flag="warning" test="not(G_SG22/S_MOA)">[EDIFACT-SR-150] - The MOA segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG26">
      <assert id="EDIFACT-SR-151" flag="warning" test="not(S_EFI/C_C099)">[EDIFACT-SR-151] - The C099 composite should not be used</assert>
      <assert id="EDIFACT-SR-152" flag="warning" test="not(S_EFI/D_1050)">[EDIFACT-SR-152] - The Sequence position identifier should not be used</assert>
      <assert id="EDIFACT-SR-153" flag="warning" test="not(S_EFI/D_9450)">[EDIFACT-SR-153] - The File compression technique name should not be used</assert>
      <assert id="EDIFACT-SR-154" flag="warning" test="not(S_CED)">[EDIFACT-SR-154] - The CED segment should not be used</assert>
      <assert id="EDIFACT-SR-156" flag="warning" test="not(S_DTM)">[EDIFACT-SR-156] - The DTM segment should not be used</assert>
      <assert id="EDIFACT-SR-157" flag="warning" test="not(S_QTY)">[EDIFACT-SR-157] - The QTY segment should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG27">
      <assert id="EDIFACT-SR-158" flag="warning" test="not(S_LIN/D_1229)">[EDIFACT-SR-158] - The Action code should not be used</assert>
      <assert id="EDIFACT-SR-159" flag="warning" test="not(S_LIN/C_C212/D_1131)">[EDIFACT-SR-159] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-160" flag="warning" test="not(S_LIN/C_C212/D_3055)">[EDIFACT-SR-160] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-161" flag="warning" test="not(S_LIN/C_C829)">[EDIFACT-SR-161] - The Sub-line information should not be used</assert>
      <assert id="EDIFACT-SR-162" flag="warning" test="not(S_LIN/D_1222)">[EDIFACT-SR-162] - The Configuration level number should not be used</assert>
      <assert id="EDIFACT-SR-163" flag="warning" test="not(S_LIN/D_7083)">[EDIFACT-SR-163] - The Configuration operation code should not be used</assert>
      <assert id="EDIFACT-SR-164" flag="warning" test="S_PIA[D_4347 = ('1', '5')] or not (S_PIA)">[EDIFACT-SR-164] - The Product identifier code qualifier must be '1' or '5'</assert>
      <assert id="EDIFACT-SR-165" flag="warning" test="not(S_PIA/C_C212/D_1131)">[EDIFACT-SR-165] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-166" flag="warning" test="not(S_PIA/C_C212/D_3055)">[EDIFACT-SR-166] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-167" flag="warning" test="not(S_PIA/C_C212_2)">[EDIFACT-SR-167] - The Item number identification composite 2 should not be used</assert>
      <assert id="EDIFACT-SR-168" flag="warning" test="not(S_PIA/C_C212_3)">[EDIFACT-SR-168] - The Item number identification composite 3 should not be used</assert>
      <assert id="EDIFACT-SR-169" flag="warning" test="not(S_PIA/C_C212_4)">[EDIFACT-SR-169] - The Item number identification composite 4 should not be used</assert>
      <assert id="EDIFACT-SR-170" flag="warning" test="not(S_PIA/C_C212_5)">[EDIFACT-SR-170] - The Item number identification composite 5 should not be used</assert>
      <assert id="EDIFACT-SR-171" flag="warning" test="not(S_PGI)">[EDIFACT-SR-171] - The PGI segment should not be used</assert>
      <assert id="EDIFACT-SR-172" flag="warning" test="S_IMD[D_7077='F'] or S_IMD[D_7077='A']">[EDIFACT-SR-172] - Only Item description and Item name should be used</assert>
      <assert id="EDIFACT-SR-173" flag="warning" test="not(S_IMD/C_C272/D_1131)">[EDIFACT-SR-173] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-174" flag="warning" test="not(S_IMD/C_C272/D_3055)">[EDIFACT-SR-174] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-175" flag="warning" test="not(S_IMD/C_C273/D_1131)">[EDIFACT-SR-175] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-176" flag="warning" test="not(S_IMD/C_C273/D_3055)">[EDIFACT-SR-176] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-177" flag="warning" test="not(S_IMD/C_C273/D_7008_2)">[EDIFACT-SR-177] - The second Item description should not be used</assert>
      <assert id="EDIFACT-SR-178" flag="warning" test="not(S_IMD/C_C273/D_3453)">[EDIFACT-SR-178] - The Language name code should not be used</assert>
      <assert id="EDIFACT-SR-179" flag="warning" test="not(S_IMD/D_3055)">[EDIFACT-SR-179] - The Surface or layer code should not be used</assert>
      <assert id="EDIFACT-SR-180" flag="warning" test="not(S_MEA)">[EDIFACT-SR-180] - The MEA segment should not be used</assert>
      <assert id="EDIFACT-SR-181" flag="warning" test="S_QTY/C_C186[D_6063='47']/D_6411 or not (S_QTY)">[EDIFACT-SR-181] - Only the Invoiced quantity including a measurement unit should be used</assert>
      <assert id="EDIFACT-SR-182" flag="warning" test="not(S_PCD)">[EDIFACT-SR-182] - The PCD segment should not be used</assert>
      <assert id="EDIFACT-SR-183" flag="warning" test="not(S_ALI) or S_ALI/D_3239">[EDIFACT-SR-183] - If the ALI segment is used the Country of origin identifier needs to be stated</assert>
      <assert id="EDIFACT-SR-184" flag="warning" test="not(S_ALI/D_9213)">[EDIFACT-SR-184] - The Duty regime type code should not be used</assert>
      <assert id="EDIFACT-SR-185" flag="warning" test="not(S_ALI/D_4183)">[EDIFACT-SR-185] - The Special condition code should not be used</assert>
      <assert id="EDIFACT-SR-186" flag="warning" test="not(S_ALI/D_4183_2)">[EDIFACT-SR-186] - The Special condition 2 code should not be used</assert>
      <assert id="EDIFACT-SR-187" flag="warning" test="not(S_ALI/D_4183_3)">[EDIFACT-SR-187] - The Special condition 3 code should not be used</assert>
      <assert id="EDIFACT-SR-188" flag="warning" test="not(S_ALI/D_4183_4)">[EDIFACT-SR-188] - The Special condition 4 code should not be used</assert>
      <assert id="EDIFACT-SR-189" flag="warning" test="not(S_ALI/D_4183_5)">[EDIFACT-SR-189] - The Special condition 5 code should not be used</assert>
      <assert id="EDIFACT-SR-190" flag="warning" test="not(S_DTM) or (S_DTM/C_C507[D_2005 = ('167','168') and D_2379='102']/D_2380)">[EDIFACT-SR-190] - Only the Invoice line period start date or Invoice line period end date should be used</assert>
      <assert id="EDIFACT-SR-191" flag="warning" test="not(S_GIN)">[EDIFACT-SR-191] - The GIN segment should not be used</assert>
      <assert id="EDIFACT-SR-192" flag="warning" test="not(S_GIR)">[EDIFACT-SR-192] - The GIR segment should not be used</assert>
      <assert id="EDIFACT-SR-193" flag="warning" test="not(S_QVR)">[EDIFACT-SR-193] - The QVR segment should not be used</assert>
      <assert id="EDIFACT-SR-194" flag="warning" test="not(S_EQD)">[EDIFACT-SR-194] - The EQD segment should not be used</assert>
      <assert id="EDIFACT-SR-195" flag="warning" test="not(S_FTX) or (S_FTX[D_4451='ACB']/C_C108/D_4440) or ((S_FTX[D_4451='ACF']/C_C108/D_4440) and (S_FTX[D_4451='ACF']/C_C108/D_4440_2))">[EDIFACT-SR-195] - Only Invoice line note, Invoiced item VAT exemption reason text, Item attribute name or Item attribute value should be used</assert>
      <assert id="EDIFACT-SR-196" flag="warning" test="not(S_FTX/C_C107/D_1131)">[EDIFACT-SR-196] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-197" flag="warning" test="not(S_FTX/C_C107/D_3055)">[EDIFACT-SR-197] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-198" flag="warning" test="not(S_FTX/C_C108/D_4440_3)">[EDIFACT-SR-198] - The Free text 3 should not be used</assert>
      <assert id="EDIFACT-SR-199" flag="warning" test="not(S_FTX/C_C108/D_4440_4)">[EDIFACT-SR-199] - The Free text 4 should not be used</assert>
      <assert id="EDIFACT-SR-200" flag="warning" test="not(S_FTX/C_C108/D_4440_5)">[EDIFACT-SR-200] - The Free text 5 should not be used</assert>
      <assert id="EDIFACT-SR-201" flag="warning" test="not(S_FTX/D_3453)">[EDIFACT-SR-201] - The Language name code should not be used</assert>
      <assert id="EDIFACT-SR-202" flag="warning" test="not(S_FTX/D_34447)">[EDIFACT-SR-202] - The Free text format code should not be used</assert>
      <assert id="EDIFACT-SR-203" flag="warning" test="not(S_DGS)">[EDIFACT-SR-203] - The DGS segment should not be used</assert>
      <assert id="EDIFACT-SR-204" flag="warning" test="G_SG28/S_MOA/C_C516[D_5025='203']/D_5004">[EDIFACT-SR-204] - Only the Invoice line net amount should be used</assert>
      <assert id="EDIFACT-SR-205" flag="warning" test="not(G_SG28/S_MOA/C_C516/D_6345)">[EDIFACT-SR-205] - The Currency identification code should not be used</assert>
      <assert id="EDIFACT-SR-206" flag="warning" test="not(G_SG28/S_MOA/C_C516/D_6343)">[EDIFACT-SR-206] - The Currency type code qualifier should not be used</assert>
      <assert id="EDIFACT-SR-207" flag="warning" test="not(G_SG28/S_MOA/C_C516/D_4405)">[EDIFACT-SR-207] - The Status description code should not be used</assert>
      <assert id="EDIFACT-SR-208" flag="warning" test="not(G_SG28/S_CUX)">[EDIFACT-SR-208] - The CUX segment should not be used</assert>
      <assert id="EDIFACT-SR-209" flag="warning" test="not(G_SG29)">[EDIFACT-SR-209] - The SG29 segment group should not be used</assert>
      <assert id="EDIFACT-SR-210" flag="warning" test="G_SG30/S_PRI/C_C509[D_5125=('AAA', 'AAB')]/D_5118">[EDIFACT-SR-210] - Only the item net price, the item gross price and the corresponding base quantity including it's unit of measurement should be stated</assert>
      <assert id="EDIFACT-SR-211" flag="warning" test="not(G_SG30/S_PRI/C_C509/D_5375)">[EDIFACT-SR-211] - The Price type code should not be used</assert>
      <assert id="EDIFACT-SR-212" flag="warning" test="not(G_SG30/S_PRI/C_C509/D_5387)">[EDIFACT-SR-212] - The Price specification code should not be used</assert>
      <assert id="EDIFACT-SR-213" flag="warning" test="not(G_SG30/S_PRI/D_5213)">[EDIFACT-SR-213] - The Sub-line item price change operation code should not be used</assert>
      <assert id="EDIFACT-SR-214" flag="warning" test="not(G_SG30/S_CUX)">[EDIFACT-SR-214] - The CUX segment should not be used</assert>
      <assert id="EDIFACT-SR-215" flag="warning" test="not(G_SG30/S_APR)">[EDIFACT-SR-215] - The APR segment should not be used</assert>
      <assert id="EDIFACT-SR-216" flag="warning" test="not(G_SG30/S_RNG)">[EDIFACT-SR-216] - The RNG segment should not be used</assert>
      <assert id="EDIFACT-SR-217" flag="warning" test="not(G_SG30/S_DTM)">[EDIFACT-SR-217] - The DTM segment should not be used</assert>
      <assert id="EDIFACT-SR-218" flag="warning" test="(G_SG31/S_RFF/C_C506[D_1153=('AVE','AWQ')]/D_1154) or (G_SG31/S_RFF/C_C506[D_1153='ON']/D_1156) or not (G_SG31)">[EDIFACT-SR-218] - Only the Invoiced line object identifier, the Referenced purchase order line identifier or the Buyer accounting reference should be used with the line item RFF</assert>
      <assert id="EDIFACT-SR-219" flag="warning" test="not(G_SG31/S_RFF/C_C506[D_1153!='ON']/D_1156)">[EDIFACT-SR-219] - The Document line identifier should only be used with a referenced purchase order</assert>
      <assert id="EDIFACT-SR-220" flag="warning" test="not(G_SG31/S_RFF/C_C506/D_1056)">[EDIFACT-SR-220] - The Version identifier should not be used</assert>
      <assert id="EDIFACT-SR-221" flag="warning" test="not(G_SG31/S_RFF/C_C506/D_1060)">[EDIFACT-SR-221] - The Revision identifier should not be used</assert>
      <assert id="EDIFACT-SR-222" flag="warning" test="not(G_SG31/S_DTM)">[EDIFACT-SR-222] - The DTM segment should not be used</assert>
      <assert id="EDIFACT-SR-223" flag="warning" test="not(G_SG32)">[EDIFACT-SR-223] - The SG32 segment group should not be used</assert>
      <assert id="EDIFACT-SR-224" flag="warning" test="not(G_SG34)">[EDIFACT-SR-224] - The SG34 segment group should not be used</assert>
      <assert id="EDIFACT-SR-225" flag="warning" test="G_SG35/S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305">[EDIFACT-SR-225] - The Invoiced item VAT category code must be used</assert>
      <assert id="EDIFACT-SR-226" flag="warning" test="not(G_SG35/S_TAX/C_C241/D_1131)">[EDIFACT-SR-226] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-227" flag="warning" test="not(G_SG35/S_TAX/C_C241/D_3055)">[EDIFACT-SR-227] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-228" flag="warning" test="not(G_SG35/S_TAX/C_C241/D_5152)">[EDIFACT-SR-228] - The Duty or tax or fee type name should not be used</assert>
      <assert id="EDIFACT-SR-229" flag="warning" test="not(G_SG35/S_TAX/C_C533)">[EDIFACT-SR-229] - The Duty/tax/fee account detail should not be used</assert>
      <assert id="EDIFACT-SR-230" flag="warning" test="not(G_SG35/S_TAX/D_5286)">[EDIFACT-SR-230] - The Duty or tax or fee assessment basis quantity should not be used</assert>
      <assert id="EDIFACT-SR-231" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_5279)">[EDIFACT-SR-231] - The Duty or tax or fee rate code account detail should not be used</assert>
      <assert id="EDIFACT-SR-232" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_1131)">[EDIFACT-SR-232] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-233" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_3055)">[EDIFACT-SR-233] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-234" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_5273)">[EDIFACT-SR-234] - The Duty or tax or fee rate basis code should not be used</assert>
      <assert id="EDIFACT-SR-235" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_1131_2)">[EDIFACT-SR-235] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-236" flag="warning" test="not(G_SG35/S_TAX/C_C243/D_3055_2)">[EDIFACT-SR-236] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-237" flag="warning" test="not(G_SG35/S_TAX/D_3446)">[EDIFACT-SR-237] - The Party tax identifier should not be used</assert>
      <assert id="EDIFACT-SR-238" flag="warning" test="not(G_SG35/S_TAX/D_1227)">[EDIFACT-SR-238] - The Calculation sequence code should not be used</assert>
      <assert id="EDIFACT-SR-239" flag="warning" test="not(G_SG35/S_TAX/D_5307)">[EDIFACT-SR-239] - The Tax or duty or fee payment due date code should not be used</assert>
      <assert id="EDIFACT-SR-240" flag="warning" test="not(G_SG35/S_MOA)">[EDIFACT-SR-240] - The MOA segment should not be used</assert>
      <assert id="EDIFACT-SR-241" flag="warning" test="not(G_SG35/S_LOC)">[EDIFACT-SR-241] - The LOC segment should not be used</assert>
      <assert id="EDIFACT-SR-242" flag="warning" test="not(G_SG36)">[EDIFACT-SR-242] - The SG36 segment group should not be used</assert>
      <assert id="EDIFACT-SR-243" flag="warning" test="not (G_SG40) or G_SG40[S_ALC/D_5463='A']/G_SG43/S_MOA/C_C516[D_5025='509']/D_5004 or    G_SG40[G_SG43/S_MOA/C_C516/D_5025='204']/S_ALC[D_5463='A']/C_C552/D_1230 or   G_SG40[G_SG43/S_MOA/C_C516/D_5025='23']/S_ALC[D_5463='C']/C_C552/D_1230">[EDIFACT-SR-243] - Only item price discount, invoice line charges or invoice line allowances should be used in SG40</assert>
      <assert id="EDIFACT-SR-244" flag="warning" test="not(G_SG40/S_ALC/D_4471)">[EDIFACT-SR-244] - The Settlement means code should not be used</assert>
      <assert id="EDIFACT-SR-245" flag="warning" test="not(G_SG40/S_ALC/D_1227)">[EDIFACT-SR-245] - The Calculation sequence code should not be used</assert>
      <assert id="EDIFACT-SR-246" flag="warning" test="not(G_SG40/S_ALC/C_C214)  or (G_SG40/S_ALC/D_5463='C')">[EDIFACT-SR-246] - The Special services identification should not be used</assert>
      <assert id="EDIFACT-SR-247" flag="warning" test="not(G_SG40/S_ALI)">[EDIFACT-SR-247] - The ALI segment should not be used</assert>
      <assert id="EDIFACT-SR-248" flag="warning" test="not(G_SG40/S_DTM)">[EDIFACT-SR-248] - The DTM segment should not be used</assert>
      <assert id="EDIFACT-SR-249" flag="warning" test="not(G_SG40/S_FTX)">[EDIFACT-SR-249] - The FTX segment should not be used</assert>
      <assert id="EDIFACT-SR-250" flag="warning" test="not(G_SG40/G_SG41)">[EDIFACT-SR-250] - The SG41 segment group should not be used</assert>
      <assert id="EDIFACT-SR-251" flag="fatal" test="(G_SG40[S_ALC/D_5463='A']/G_SG42/S_PCD/C_C501[D_5245='1']/D_5482) or    (G_SG40[S_ALC/D_5463='C']/G_SG42/S_PCD/C_C501[D_5245='2']/D_5482) or   not(G_SG40/G_SG42)">[EDIFACT-SR-251] - The percentage type code must match the Allowance or charge code</assert>
      <assert id="EDIFACT-SR-252" flag="warning" test="not(G_SG40/G_SG42/S_PCD/C_C501/D_5249)">[EDIFACT-SR-252] - The Percentage basis identification code should not be used</assert>
      <assert id="EDIFACT-SR-253" flag="warning" test="not(G_SG40/G_SG42/S_PCD/C_C501/D_1131)">[EDIFACT-SR-253] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-254" flag="warning" test="not(G_SG40/G_SG42/S_PCD/C_C501/D_3055)">[EDIFACT-SR-254] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-255" flag="warning" test="not(G_SG40/G_SG42/S_PCD/D_4405)">[EDIFACT-SR-255] - The Status description code should not be used</assert>
      <assert id="EDIFACT-SR-256" flag="warning" test="not(G_SG40/G_SG42/S_RNG)">[EDIFACT-SR-256] - The RNG segment should not be used</assert>
      <assert id="EDIFACT-SR-257" flag="warning" test="(G_SG40/G_SG43/S_MOA/C_C516[D_5025=('23', '25', '204', '509')]) or not (G_SG40/G_SG43)">[EDIFACT-SR-257] - Only codes '23', '25', '204' or '509' should be used</assert>
      <assert id="EDIFACT-SR-258" flag="warning" test="not(G_SG40/G_SG43/S_MOA/C_C516/D_6345)">[EDIFACT-SR-258] - The Currency identification code should not be used</assert>
      <assert id="EDIFACT-SR-259" flag="warning" test="not(G_SG40/G_SG43/S_MOA/C_C516/D_6343)">[EDIFACT-SR-259] - The Currency type code qualifier should not be used</assert>
      <assert id="EDIFACT-SR-260" flag="warning" test="not(G_SG40/G_SG43/S_MOA/C_C516/D_4405)">[EDIFACT-SR-260] - The Status description code should not be used</assert>
      <assert id="EDIFACT-SR-261" flag="warning" test="not(G_SG40/G_SG43/S_RNG)">[EDIFACT-SR-261] - The RNG segment should not be used</assert>
      <assert id="EDIFACT-SR-262" flag="warning" test="not(G_SG40/G_SG43/S_CUX)">[EDIFACT-SR-262] - The CUX segment should not be used</assert>
      <assert id="EDIFACT-SR-263" flag="warning" test="not(G_SG40/G_SG43/S_DTM)">[EDIFACT-SR-263] - The DTM segment should not be used</assert>
      <assert id="EDIFACT-SR-264" flag="warning" test="not(G_SG40/G_SG44)">[EDIFACT-SR-264] - The SG44 segment group should not be used</assert>
      <assert id="EDIFACT-SR-265" flag="warning" test="not(G_SG40/G_SG45)">[EDIFACT-SR-265] - The SG45 segment group should not be used</assert>
      <assert id="EDIFACT-SR-266" flag="warning" test="not(G_SG46)">[EDIFACT-SR-266] - The SG46 segment group should not be used</assert>
      <assert id="EDIFACT-SR-267" flag="warning" test="not(G_SG48)">[EDIFACT-SR-267] - The SG48 segment group should not be used</assert>
      <assert id="EDIFACT-SR-268" flag="warning" test="not(G_SG49)">[EDIFACT-SR-268] - The SG49 segment group should not be used</assert>
      <assert id="EDIFACT-SR-269" flag="warning" test="not(G_SG50)">[EDIFACT-SR-269] - The SG50 segment group should not be used</assert>
      <assert id="EDIFACT-SR-270" flag="warning" test="not(G_SG51)">[EDIFACT-SR-270] - The SG51 segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG52">
      <assert id="EDIFACT-SR-271" flag="warning" test="S_MOA/C_C516[D_5025 = ('2', '9', '79', '113', '176', '259', '260', '366', '388', '389')]/D_5004">[EDIFACT-SR-271] - Only codes '2', '9', '79', '113', '176', '259', '260', '366', '388', '389' should be used</assert>
      <assert id="EDIFACT-SR-272" flag="warning" test="not(S_MOA/C_C516/D_6345)">[EDIFACT-SR-272] - The Currency identification code should not be used</assert>
      <assert id="EDIFACT-SR-273" flag="warning" test="not(S_MOA/C_C516/D_6343)">[EDIFACT-SR-273] - The Currency type code qualifier should not be used</assert>
      <assert id="EDIFACT-SR-274" flag="warning" test="not(S_MOA/C_C516/D_4405)">[EDIFACT-SR-274] - The Status description code should not be used</assert>
      <assert id="EDIFACT-SR-275" flag="warning" test="not(G_SG53)">[EDIFACT-SR-275] - The SG53 segment group should not be used</assert>
    </rule>
    <rule context="/M_INVOIC/G_SG54">
      <assert id="EDIFACT-SR-276" flag="warning" test="(S_TAX[D_5283='7' and C_C241/D_5153='VAT']/D_5305) and    (S_MOA/C_C516[D_5025 = ('124', '125')]/D_5004)">[EDIFACT-SR-276] - Only VAT breakdown information should be used</assert>
      <assert id="EDIFACT-SR-277" flag="warning" test="not(S_TAX/C_C241/D_1131)">[EDIFACT-SR-277] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-278" flag="warning" test="not(S_TAX/C_C241/D_3055)">[EDIFACT-SR-278] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-279" flag="warning" test="not(S_TAX/C_C241/D_5152)">[EDIFACT-SR-279] - The Duty or tax or fee type name should not be used</assert>
      <assert id="EDIFACT-SR-280" flag="warning" test="not(S_TAX/C_C533)">[EDIFACT-SR-280] - The Duty/tax/fee account detail should not be used</assert>
      <assert id="EDIFACT-SR-281" flag="warning" test="not(S_TAX/D_5286)">[EDIFACT-SR-281] - The Duty or tax or fee account code should not be used</assert>
      <assert id="EDIFACT-SR-282" flag="warning" test="not(S_TAX/C_C243/D_5279)">[EDIFACT-SR-282] - The Duty or tax or fee rate code should not be used</assert>
      <assert id="EDIFACT-SR-283" flag="warning" test="not(S_TAX/C_C243/D_1131)">[EDIFACT-SR-283] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-284" flag="warning" test="not(S_TAX/C_C243/D_3055)">[EDIFACT-SR-284] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-285" flag="warning" test="not(S_TAX/C_C243/D_5273)">[EDIFACT-SR-285] - The Duty or tax or fee rate basis code should not be used</assert>
      <assert id="EDIFACT-SR-286" flag="warning" test="not(S_TAX/C_C243/D_1131_2)">[EDIFACT-SR-286] - The Code list identification code should not be used</assert>
      <assert id="EDIFACT-SR-287" flag="warning" test="not(S_TAX/C_C243/D_3055_2)">[EDIFACT-SR-287] - The Code list responsible agency code should not be used</assert>
      <assert id="EDIFACT-SR-288" flag="warning" test="not(S_TAX/D_3446)">[EDIFACT-SR-288] - The Party tax identifier should not be used</assert>
      <assert id="EDIFACT-SR-289" flag="warning" test="not(S_TAX/D_1227)">[EDIFACT-SR-289] - The Calculation sequence code should not be used</assert>
      <assert id="EDIFACT-SR-290" flag="warning" test="not(S_TAX/D_5307)">[EDIFACT-SR-290] - The Tax or duty or fee payment due date code should not be used</assert>
      <assert id="EDIFACT-SR-291" flag="warning" test="not(S_MOA/C_C516/D_6343)">[EDIFACT-SR-291] - The Currency type code qualifier should not be used</assert>
      <assert id="EDIFACT-SR-292" flag="warning" test="not(S_MOA/C_C516/D_4405)">[EDIFACT-SR-292] - The Status description code should not be used</assert>
    </rule>
  </pattern>
  <pattern id="EN16931-Codes">
    <rule flag="warning" context="//D_3453">
      <assert flag="warning" test="((not(contains(normalize-space(.), ' ')) and contains(' aar abk ace ach ada ady afa afh afr ain aka akk alb ale alg alt amh ang anp apa ara arc arg arm arn arp art arw asm ast ath aus ava ave awa aym aze bad bai bak bal bam ban baq bas bat bej bel bem ben ber bho bih bik bin bis bla bnt bos bra bre btk bua bug bul bur byn cad cai car cat cau ceb cel cha chb che chg chi chk chm chn cho chp chr chu chv chy cmc cop cor cos cpe cpf cpp cre crh crp csb cus cze dak dan dar day del den dgr din div doi dra dsb dua dum dut dyu dzo efi egy eka elx eng enm epo est ewe ewo fan fao fat fij fil fin fiu fon fre frm fro frr frs fry ful fur gaa gay gba gem geo ger gez gil gla gle glg glv gmh goh gon gor got grb grc gre grn gsw guj gwi hai hat hau haw heb her hil him hin hit hmn hmo hsb hun hup iba ibo ice ido iii ijo iku ile ilo ina inc ind ine inh ipk ira iro ita jav jbo jpn jpr jrb kaa kab kac kal kam kan kar kas kau kaw kaz kbd kha khi khm kho kik kin kir kmb kok kom kon kor kos kpe krc krl kro kru kua kum kur kut lad lah lam lao lat lav lez lim lin lit lol loz ltz lua lub lug lui lun luo lus mac mad mag mah mai mak mal man mao map mar mas may mdf mdr men mga mic min mis mkh mlg mlt mnc mni mno moh mol mon mos mul mun mus mwl mwr myn myv nah nai nap nau nav nbl nde ndo nds nep new nia nic niu nno nob nog non nor nqo nso nub nwc nya nym nyn nyo nzi oci oji ori orm osa oss ota oto paa pag pal pam pan pap pau peo per phi phn pli pol pon por pra pro pus que raj rap rar roa roh rom rum run rup rus sad sag sah sai sal sam san sas sat scc scn sco scr sel sem sga sgn shn sid sin sio sit sla slo slv sma sme smi smj smn smo sms sna snd snk sog som son sot spa srd srn srr ssa ssw suk sun sus sux swa swe syr tah tai tam tat tel tem ter tet tgk tgl tha tib tig tir tiv tkl tlh tli tmh tog ton tpi tsi tsn tso tuk tum tup tur tut tvl twi tyv udm uga uig ukr umb und urd uzb vai ven vie vol vot wak wal war was wel wen wln wol xal xho yao yap yid yor ypk zap zen zha znd zul zun zxx zza ', concat(' ', normalize-space(.), ' '))))">[CL-02]-The lists of valid languages are registered with the ISO 639
      Maintenance Agency Codes for the Representation of Names of Languages. It is recommended to
      use the ISO 639-2 alpha-3 representation</assert>
    </rule>
    <rule flag="fatal" context="//D_6345">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BOV BRL BSD BTN BWP BYR BZD CAD CDF CHE CHF CHW CLF CLP CNY COP COU CRC CUC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRO MUR MVR MWK MXN MXV MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLL SOS SRD SSP STD SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD USN UYI UYU UZS VEF VND VUV WST XAF XAG XAU XBA XBB XBC XBD XCD XDR XOF XPD XPF XPT XSU XTS XUA XXX YER ZAR ZMW ZWL ', concat(' ', normalize-space(.), ' '))))">[CL-03]-currencyID MUST be coded using ISO code list 4217 alpha-3</assert>
    </rule>
    <rule flag="fatal" context="//D_2005[not (../D_2380)]">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' 3 35 432 ', concat(' ', normalize-space(.), ' '))))">[CL-04]-Value added tax point date code MUST be coded using a restriction of UNTDID 2005</assert>
    </rule>
    <rule flag="fatal" context="//D_1153">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AAA AAB AAC AAD AAE AAF AAG AAH AAI AAJ AAK AAL AAM AAN AAO AAP AAQ AAR AAS AAT AAU AAV AAW AAX AAY AAZ ABA ABB ABC ABD ABE ABF ABG ABH ABI ABJ ABK ABL ABM ABN ABO ABP ABQ ABR ABS ABT ABU ABV ABW ABX ABY ABZ AC ACA ACB ACC ACD ACE ACF ACG ACH ACI ACJ ACK ACL ACN ACO ACP ACQ ACR ACT ACU ACV ACW ACX ACY ACZ ADA ADB ADC ADD ADE ADF ADG ADI ADJ ADK ADL ADM ADN ADO ADP ADQ ADT ADU ADV ADW ADX ADY ADZ AE AEA AEB AEC AED AEE AEF AEG AEH AEI AEJ AEK AEL AEM AEN AEO AEP AEQ AER AES AET AEU AEV AEW AEX AEY AEZ AF AFA AFB AFC AFD AFE AFF AFG AFH AFI AFJ AFK AFL AFM AFN AFO AFP AFQ AFR AFS AFT AFU AFV AFW AFX AFY AFZ AGA AGB AGC AGD AGE AGF AGG AGH AGI AGJ AGK AGL AGM AGN AGO AGP AGQ AGR AGS AGT AGU AGV AGW AGX AGY AGZ AHA AHB AHC AHD AHE AHF AHG AHH AHI AHJ AHK AHL AHM AHN AHO AHP AHQ AHR AHS AHT AHU AHV AHX AHY AHZ AIA AIB AIC AID AIE AIF AIG AIH AII AIJ AIK AIL AIM AIN AIO AIP AIQ AIR AIS AIT AIU AIV AIW AIX AIY AIZ AJA AJB AJC AJD AJE AJF AJG AJH AJI AJJ AJK AJL AJM AJN AJO AJP AJQ AJR AJS AJT AJU AJV AJW AJX AJY AJZ AKA AKB AKC AKD AKE AKF AKG AKH AKI AKJ AKK AKL AKM AKN AKO AKP AKQ AKR AKS AKT AKU AKV AKW AKX AKY AKZ ALA ALB ALC ALD ALE ALF ALG ALH ALI ALJ ALK ALL ALM ALN ALO ALP ALQ ALR ALS ALT ALU ALV ALW ALX ALY ALZ AMA AMB AMC AMD AME AMF AMG AMH AMI AMJ AMK AML AMM AMN AMO AMP AMQ AMR AMS AMT AMU AMV AMW AMX AMY AMZ ANA ANB ANC AND ANE ANF ANG ANH ANI ANJ ANK ANL ANM ANN ANO ANP ANQ ANR ANS ANT ANU ANV ANW ANX ANY AOA AOD AOE AOF AOG AOH AOI AOJ AOK AOL AOM AON AOO AOP AOQ AOR AOS AOT AOU AOV AOW AOX AOY AOZ AP APA APB APC APD APE APF APG APH API APJ APK APL APM APN APO APP APQ APR APS APT APU APV APW APX APY APZ AQA AQB AQC AQD AQE AQF AQG AQH AQI AQJ AQK AQL AQM AQN AQO AQP AQQ AQR AQS AQT AQU AQV AQW AQX AQY AQZ ARA ARB ARC ARD ARE ARF ARG ARH ARI ARJ ARK ARL ARM ARN ARO ARP ARQ ARR ARS ART ARU ARV ARW ARX ARY ARZ ASA ASB ASC ASD ASE ASF ASG ASH ASI ASJ ASK ASL ASM ASN ASO ASP ASQ ASR ASS AST ASU ASV ASW ASX ASY ASZ ATA ATB ATC ATD ATE ATF ATG ATH ATI ATJ ATK ATL ATM ATN ATO ATP ATQ ATR ATS ATT ATU ATV ATW ATX ATY ATZ AU AUA AUB AUC AUD AUE AUF AUG AUH AUI AUJ AUK AUL AUM AUN AUO AUP AUQ AUR AUS AUT AUU AUV AUW AUX AUY AUZ AV AVA AVB AVC AVD AVE AVF AVG AVH AVI AVJ AVK AVL AVM AVN AVO AVP AVQ AVR AVS AVT AVU AVV AVW AVX AVY AVZ AWA AWB AWC AWD AWE AWF AWG AWH AWI AWJ AWK AWL AWM AWN AWO AWP AWQ AWR AWS AWT AWU AWV AWW AWX AWY AWZ AXA AXB AXC AXD AXE AXF AXG AXH AXI AXJ AXK AXL AXM AXN AXO AXP AXQ AXR BA BC BD BE BH BM BN BO BR BT BW CAS CAT CAU CAV CAW CAX CAY CAZ CBA CBB CD CEC CED CFE CFF CFO CG CH CK CKN CM CMR CN CNO COF CP CR CRN CS CST CT CU CV CW CZ DA DAN DB DI DL DM DQ DR EA EB ED EE EI EN EQ ER ERN ET EX FC FF FI FLW FN FO FS FT FV FX GA GC GD GDN GN HS HWB IA IB ICA ICE ICO II IL INB INN INO IP IS IT IV JB JE LA LAN LAR LB LC LI LO LRC LS MA MB MF MG MH MR MRN MS MSS MWB NA NF OH OI ON OP OR PB PC PD PE PF PI PK PL POR PP PQ PR PS PW PY RA RC RCN RE REN RF RR RT SA SB SD SE SEA SF SH SI SM SN SP SQ SRN SS STA SW SZ TB TCR TE TF TI TIN TL TN TP UAR UC UCN UN UO URI VA VC VGR VM VN VON VOR VP VR VS VT VV WE WM WN WR WS WY XA XC XP ZZZ ', concat(' ', normalize-space(.), ' '))))">[CL-05]-Object identifier identification scheme identifer MUST be coded using UNTDID 1153</assert>
    </rule>
    <rule flag="fatal" context="//D_4451">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AAA AAB AAC AAD AAE AAF AAG AAI AAJ AAK AAL AAM AAN AAO AAP AAQ AAR AAS AAT AAU AAV AAW AAX AAY AAZ ABA ABB ABC ABD ABE ABF ABG ABH ABI ABJ ABK ABL ABM ABN ABO ABP ABQ ABR ABS ABT ABU ABV ABW ABX ABZ ACA ACB ACC ACD ACE ACF ACG ACH ACI ACJ ACK ACL ACM ACN ACO ACP ACQ ACR ACS ACT ACU ACV ACW ACX ACY ACZ ADA ADB ADC ADD ADE ADF ADG ADH ADI ADJ ADK ADL ADM ADN ADO ADP ADQ ADR ADS ADT ADU ADV ADW ADX ADY ADZ AEA AEB AEC AED AEE AEF AEG AEH AEI AEJ AEK AEL AEM AEN AEO AEP AEQ AER AES AET AEU AEV AEW AEX AEY AEZ AFA AFB AFC AFD AFE AFF AFG AFH AFI AFJ AFK AFL AFM AFN AFO AFP AFQ AFR AFS AFT AFU AFV AFW AFX AFY AFZ AGA AGB AGC AGD AGE AGF AGG AGH AGI AGJ AGK AGL AGM AGN AGO AGP AGQ AGR AGS AGT AGU AGV AGW AGX AGY AGZ AHA AHB AHC AHD AHE AHF AHG AHH AHI AHJ AHK AHL AHM AHN AHO AHP AHQ AHR AHS AHT AHU AHV AHW AHX AHY AHZ AIA AIB AIC AID AIE AIF AIG AIH AII AIJ AIK AIL AIM AIN AIO AIP AIQ AIR AIS AIT AIU AIV AIW AIX AIY AIZ AJA AJB ALC ALD ALE ALF ALG ALH ALI ALJ ALK ALL ALM ALN ALO ALP ALQ ARR ARS AUT AUU AUV AUW AUX AUY AUZ AVA AVB AVC AVD AVE AVF BAG BAH BAI BAJ BAK BAL BAM BAN BAO BAP BAQ BLC BLD BLE BLF BLG BLH BLI BLJ BLK BLL BLM BLN BLO BLP BLQ BLR BLS BLT BLU BLV BLW BLX BLY BLZ BMA BMB BMC BMD BME CCI CEX CHG CIP CLP CLR COI CUR CUS DAR DCL DEL DIN DOC DUT EUR FBC GBL GEN GS7 HAN HAZ ICN IIN IMI IND INS INV IRP ITR ITS LAN LIN LOI MCO MDH MKS ORI OSI PAC PAI PAY PKG PKT PMD PMT PRD PRF PRI PUR QIN QQD QUT RAH REG RET REV RQR SAF SIC SIN SLR SPA SPG SPH SPP SPT SRN SSR SUR TCA TDT TRA TRR TXD WHI ZZZ ', concat(' ', normalize-space(.), ' '))))">[CL-06]-Note subject code MUST be coded using UNTDID 4451</assert>
    </rule>
    <rule flag="warning" context="//S_FTX[D_4451='DOC']/C_C107/D_4441">
      <assert flag="warning" test="((not(contains(normalize-space(.), ' ')) and contains(' P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P11 P12 ', concat(' ', normalize-space(.), ' '))))">[CL-07]-Business process type identifier SHOULD be one of the CEN TC 434 defined.</assert>
    </rule>
    <rule flag="fatal" context="//D_1131">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' 0001 0002 0003 0004 0005 0006 0007 0008 0009 0010 0011 0012 0013 0014 0015 0016 0017 0018 0019 0020 0021 0022 0023 0024 0025 0026 0027 0028 0029 0030 0031 0032 0033 0034 0035 0036 0037 0038 0039 0040 0041 0042 0043 0044 0045 0046 0047 0048 0049 0050 0051 0052 0053 0054 0055 0056 0057 0058 0059 0060 0061 0062 0063 0064 0065 0066 0067 0068 0069 0070 0071 0072 0073 0074 0075 0076 0077 0078 0079 0080 0081 0082 0083 0084 0085 0086 0087 0088 0089 0090 0091 0092 0093 0094 0095 0096 0097 0098 0099 0100 0101 0102 0103 0104 0105 0106 0107 0108 0109 0110 0111 0112 0113 0114 0115 0116 0117 0118 0119 0120 0121 0122 0123 0124 0125 0126 0127 0128 0129 0130 0131 0132 0133 0134 0135 0136 0137 0138 0139 0140 0141 0142 0143 0144 0145 0146 0147 0148 0149 0150 0151 0152 0153 0154 0155 0156 0157 0158 0159 0160 0161 0162 0163 0164 0165 0166 0167 0168 0169 0170 0171 0172 0173 0174 0175 0176 0177 0178 0179 0180 0183 0184 0190 0191 0192 0193', concat(' ', normalize-space(.), ' '))))">[CL-08]-The scheme identifier MUST be one of the ISO 6523 ICD list.</assert>
    </rule>
    <rule flag="fatal" context="//D_3207">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AD AE AF AG AI AL AM AN AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BL BJ BM BN BO BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR ST SV SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW ', concat(' ', normalize-space(.), ' '))))">[CL-09]-Country codes in an invoice MUST be coded using ISO code list
      3166-1</assert>
    </rule>
    <rule flag="fatal" context="//D_4461">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' 10 20 30 31 48 54 55 57 58 97 98 ', concat(' ', normalize-space(.), ' '))))">[CL-10]-Payment means in an invoice MUST be coded using UNTDID 4461 restricted code
      list</assert>
    </rule>
    <rule flag="fatal" context="//D_5305">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AE L M E S Z G O K ', concat(' ', normalize-space(.), ' '))))">[CL-11]-Invoice tax categories MUST be coded using UNCL 5305 code list</assert>
    </rule>
    <rule flag="fatal" context="//D_7143">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' AA AB AC AD AE AF AG AH AI AJ AK AL AM AN AO AP AQ AR AS AT AU AV AW AX AY AZ BA BB BC BD BE BF BG BH BI BJ BK BL BM BN BO BP BQ BR BS BT BU BV BW BX BY BZ CC CG CL CR CV DR DW EC EF EN FS GB GN GS HS IB IN IS IT IZ MA MF MN MP NB ON PD PL PO PV QS RC RN RU RY SA SG SK SN SRS SRT SRU SRV SRW SRX SRY SRZ SS SSA SSB SSC SSD SSE SSF SSG SSH SSI SSJ SSK SSL SSM SSN SSO SSP SSQ SSR SSS SST SSU SSV SSW SSX SSY SSZ ST STA STB STC STD STE STF STG STH STI STJ STK STL STM STN STO STP STQ STR STS STT STU STV STW STX STY STZ SUA SUB SUC SUD SUE SUF SUG SUH SUI SUJ SUK SUL SUM TG TSN TSO TSP UA UP VN VP VS VX ZZZ ', concat(' ', normalize-space(.), ' '))))">[CL-13]-Item standard identifier scheme MUST be coded using UNCL 7143 code list</assert>
    </rule>
    <rule flag="warning" context="//D_5189">
      <assert flag="warning" test="((not(contains(normalize-space(.), ' ')) and contains(' 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 ZZZ ', concat(' ', normalize-space(.), ' '))))">[CL-14]-Coded allowance reasons SHOULD belong to the UNCL 4465 code
      list</assert>
    </rule>
    <rule flag="warning" context="//D_7161">
      <assert flag="warning" test="((not(contains(normalize-space(.), ' ')) and contains(' AA AAA AAC AAD AAE AAF AAH AAI AAS AAT AAV AAY AAZ ABA ABB ABC ABD ABF ABK ABL ABN ABR ABS ABT ABU ACF ACG ACH ACI ACJ ACK ACL ACM ACS ADC ADE ADJ ADK ADL ADM ADN ADO ADP ADQ ADR ADT ADW ADY ADZ AEA AEB AEC AED AEF AEH AEI AEJ AEK AEL AEM AEN AEO AEP AES AET AEU AEV AEW AEX AEY AEZ AJ AU CA CAB CAD CAE CAF CAI CAJ CAK CAL CAM CAN CAO CAP CAQ CAR CAS CAT CAU CAV CAW CD CG CS CT DAB DAD DL EG EP ER FAA FAB FAC FC FH FI GAA HAA HD HH IAA IAB ID IF IR IS KO L1 LA LAA LAB LF MAE MI ML NAA OA PA PAA PC PL RAB RAC RAD RAF RE RF RH RV SA SAA SAD SAE SAI SG SH SM SU TAB TAC TT TV V1 V2 WH XAA YY ZZZ ', concat(' ', normalize-space(.), ' '))))">[CL-15]-Coded charge reasons SHOULD belong to the UNCL 7161 code
      list</assert>
    </rule>
    <rule flag="fatal" context="//D_6411">
      <assert flag="fatal" test="((not(contains(normalize-space(.), ' ')) and contains(' 10 11 13 14 15 20 21 22 23 24 25 27 28 33 34 35 37 38 40 41 56 57 58 59 60 61 64 66 74 76 77 78 80 81 84 85 87 89 91 1I 2A 2B 2C 2G 2H 2I 2J 2K 2L 2M 2N 2P 2Q 2R 2U 2X 2Y 2Z 3B 3C 4C 4G 4H 4K 4L 4M 4N 4O 4P 4Q 4R 4T 4U 4W 4X 5A 5B 5E 5J A1 A10 A11 A12 A13 A14 A15 A16 A17 A18 A19 A2 A20 A21 A22 A23 A24 A25 A26 A27 A28 A29 A3 A30 A31 A32 A33 A34 A35 A36 A37 A38 A39 A4 A40 A41 A42 A43 A44 A45 A47 A48 A49 A5 A50 A51 A52 A53 A54 A55 A56 A57 A58 A59 A6 A60 A61 A62 A63 A64 A65 A66 A67 A68 A69 A7 A70 A71 A73 A74 A75 A76 A77 A78 A79 A8 A80 A81 A82 A83 A84 A85 A86 A87 A88 A89 A9 A90 A91 A93 A94 A95 A96 A97 A98 A99 AA AB ACR ACT AD AE AH AI AK AL AMH AMP ANN APZ AQ ARE AS ASM ASU ATM ATT AY AZ B1 B10 B11 B12 B13 B14 B15 B16 B17 B18 B19 B20 B21 B22 B23 B24 B25 B26 B27 B28 B29 B3 B30 B31 B32 B33 B34 B35 B36 B37 B38 B39 B4 B40 B41 B42 B43 B44 B45 B46 B47 B48 B49 B50 B51 B52 B53 B54 B55 B56 B57 B58 B59 B60 B61 B62 B63 B64 B65 B66 B67 B68 B69 B7 B70 B71 B72 B73 B74 B75 B76 B77 B78 B79 B8 B80 B81 B82 B83 B84 B85 B86 B87 B88 B89 B90 B91 B92 B93 B94 B95 B96 B97 B98 B99 BAR BB BFT BHP BIL BLD BLL BP BQL BTU BUA BUI C0 C10 C11 C12 C13 C14 C15 C16 C17 C18 C19 C20 C21 C22 C23 C24 C25 C26 C27 C28 C29 C3 C30 C31 C32 C33 C34 C35 C36 C37 C38 C39 C40 C41 C42 C43 C44 C45 C46 C47 C48 C49 C50 C51 C52 C53 C54 C55 C56 C57 C58 C59 C60 C61 C62 C63 C64 C65 C66 C67 C68 C69 C7 C70 C71 C72 C73 C74 C75 C76 C78 C79 C8 C80 C81 C82 C83 C84 C85 C86 C87 C88 C89 C9 C90 C91 C92 C93 C94 C95 C96 C97 C99 CCT CDL CEL CEN CG CGM CKG CLF CLT CMK CMQ CMT CNP CNT COU CTG CTM CTN CUR CWA CWI D03 D04 D1 D10 D11 D12 D13 D15 D16 D17 D18 D19 D2 D20 D21 D22 D23 D24 D25 D26 D27 D29 D30 D31 D32 D33 D34 D35 D36 D37 D38 D39 D41 D42 D43 D44 D45 D46 D47 D48 D49 D5 D50 D51 D52 D53 D54 D55 D56 D57 D58 D59 D6 D60 D61 D62 D63 D65 D68 D69 D70 D71 D72 D73 D74 D75 D76 D77 D78 D80 D81 D82 D83 D85 D86 D87 D88 D89 D9 D91 D93 D94 D95 DAA DAD DAY DB DD DEC DG DJ DLT DMA DMK DMO DMQ DMT DN DPC DPR DPT DRA DRI DRL DT DTN DU DWT DX DZN DZP E01 E07 E08 E09 E10 E11 E12 E14 E15 E16 E17 E18 E19 E20 E21 E22 E23 E25 E27 E28 E30 E31 E32 E33 E34 E35 E36 E37 E38 E39 E4 E40 E41 E42 E43 E44 E45 E46 E47 E48 E49 E50 E51 E52 E53 E54 E55 E56 E57 E58 E59 E60 E61 E62 E63 E64 E65 E66 E67 E68 E69 E70 E71 E72 E73 E74 E75 E76 E77 E78 E79 E80 E81 E82 E83 E84 E85 E86 E87 E88 E89 E90 E91 E92 E93 E94 E95 E96 E97 E98 E99 EA EB EQ F01 F02 F03 F04 F05 F06 F07 F08 F10 F11 F12 F13 F14 F15 F16 F17 F18 F19 F20 F21 F22 F23 F24 F25 F26 F27 F28 F29 F30 F31 F32 F33 F34 F35 F36 F37 F38 F39 F40 F41 F42 F43 F44 F45 F46 F47 F48 F49 F50 F51 F52 F53 F54 F55 F56 F57 F58 F59 F60 F61 F62 F63 F64 F65 F66 F67 F68 F69 F70 F71 F72 F73 F74 F75 F76 F77 F78 F79 F80 F81 F82 F83 F84 F85 F86 F87 F88 F89 F90 F91 F92 F93 F94 F95 F96 F97 F98 F99 FAH FAR FBM FC FF FH FIT FL FOT FP FR FS FTK FTQ G01 G04 G05 G06 G08 G09 G10 G11 G12 G13 G14 G15 G16 G17 G18 G19 G2 G20 G21 G23 G24 G25 G26 G27 G28 G29 G3 G30 G31 G32 G33 G34 G35 G36 G37 G38 G39 G40 G41 G42 G43 G44 G45 G46 G47 G48 G49 G50 G51 G52 G53 G54 G55 G56 G57 G58 G59 G60 G61 G62 G63 G64 G65 G66 G67 G68 G69 G70 G71 G72 G73 G74 G75 G76 G77 G78 G79 G80 G81 G82 G83 G84 G85 G86 G87 G88 G89 G90 G91 G92 G93 G94 G95 G96 G97 G98 G99 GB GBQ GDW GE GF GFI GGR GIA GIC GII GIP GJ GL GLD GLI GLL GM GO GP GQ GRM GRN GRO GRT GT GV GWH H03 H04 H05 H06 H07 H08 H09 H10 H11 H12 H13 H14 H15 H16 H18 H19 H20 H21 H22 H23 H24 H25 H26 H27 H28 H29 H30 H31 H32 H33 H34 H35 H36 H37 H38 H39 H40 H41 H42 H43 H44 H45 H46 H47 H48 H49 H50 H51 H52 H53 H54 H55 H56 H57 H58 H59 H60 H61 H62 H63 H64 H65 H66 H67 H68 H69 H70 H71 H72 H73 H74 H75 H76 H77 H78 H79 H80 H81 H82 H83 H84 H85 H87 H88 H89 H90 H91 H92 H93 H94 H95 H96 H98 H99 HA HAR HBA HBX HC HDW HEA HGM HH HIU HJ HKM HLT HM HMQ HMT HN HP HPA HTZ HUR IA IE INH INK INQ ISD IU IV J10 J12 J13 J14 J15 J16 J17 J18 J19 J2 J20 J21 J22 J23 J24 J25 J26 J27 J28 J29 J30 J31 J32 J33 J34 J35 J36 J38 J39 J40 J41 J42 J43 J44 J45 J46 J47 J48 J49 J50 J51 J52 J53 J54 J55 J56 J57 J58 J59 J60 J61 J62 J63 J64 J65 J66 J67 J68 J69 J70 J71 J72 J73 J74 J75 J76 J78 J79 J81 J82 J83 J84 J85 J87 J89 J90 J91 J92 J93 J94 J95 J96 J97 J98 J99 JE JK JM JNT JOU JPS JWL K1 K10 K11 K12 K13 K14 K15 K16 K17 K18 K19 K2 K20 K21 K22 K23 K24 K25 K26 K27 K28 K3 K30 K31 K32 K33 K34 K35 K36 K37 K38 K39 K40 K41 K42 K43 K45 K46 K47 K48 K49 K5 K50 K51 K52 K53 K54 K55 K58 K59 K6 K60 K61 K62 K63 K64 K65 K66 K67 K68 K69 K70 K71 K73 K74 K75 K76 K77 K78 K79 K80 K81 K82 K83 K84 K85 K86 K87 K88 K89 K90 K91 K92 K93 K94 K95 K96 K97 K98 K99 KA KAT KB KBA KCC KDW KEL KGM KGS KHY KHZ KI KIC KIP KJ KJO KL KLK KLX KMA KMH KMK KMQ KMT KNI KNS KNT KO KPA KPH KPO KPP KR KSD KSH KT KTN KUR KVA KVR KVT KW KWH KWO KWT KX L10 L11 L12 L13 L14 L15 L16 L17 L18 L19 L2 L20 L21 L23 L24 L25 L26 L27 L28 L29 L30 L31 L32 L33 L34 L35 L36 L37 L38 L39 L40 L41 L42 L43 L44 L45 L46 L47 L48 L49 L50 L51 L52 L53 L54 L55 L56 L57 L58 L59 L60 L63 L64 L65 L66 L67 L68 L69 L70 L71 L72 L73 L74 L75 L76 L77 L78 L79 L80 L81 L82 L83 L84 L85 L86 L87 L88 L89 L90 L91 L92 L93 L94 L95 L96 L98 L99 LA LAC LBR LBT LD LEF LF LH LK LM LN LO LP LPA LR LS LTN LTR LUB LUM LUX LY M1 M10 M11 M12 M13 M14 M15 M16 M17 M18 M19 M20 M21 M22 M23 M24 M25 M26 M27 M29 M30 M31 M32 M33 M34 M35 M36 M37 M38 M39 M4 M40 M41 M42 M43 M44 M45 M46 M47 M48 M49 M5 M50 M51 M52 M53 M55 M56 M57 M58 M59 M60 M61 M62 M63 M64 M65 M66 M67 M68 M69 M7 M70 M71 M72 M73 M74 M75 M76 M77 M78 M79 M80 M81 M82 M83 M84 M85 M86 M87 M88 M89 M9 M90 M91 M92 M93 M94 M95 M96 M97 M98 M99 MAH MAL MAM MAR MAW MBE MBF MBR MC MCU MD MGM MHZ MIK MIL MIN MIO MIU MLD MLT MMK MMQ MMT MND MON MPA MQH MQS MSK MTK MTQ MTR MTS MVA MWH N1 N10 N11 N12 N13 N14 N15 N16 N17 N18 N19 N20 N21 N22 N23 N24 N25 N26 N27 N28 N29 N3 N30 N31 N32 N33 N34 N35 N36 N37 N38 N39 N40 N41 N42 N43 N44 N45 N46 N47 N48 N49 N50 N51 N52 N53 N54 N55 N56 N57 N58 N59 N60 N61 N62 N63 N64 N65 N66 N67 N68 N69 N70 N71 N72 N73 N74 N75 N76 N77 N78 N79 N80 N81 N82 N83 N84 N85 N86 N87 N88 N89 N90 N91 N92 N93 N94 N95 N96 N97 N98 N99 NA NAR NCL NEW NF NIL NIU NL NMI NMP NPR NPT NQ NR NT NTT NU NX OA ODE OHM ON ONZ OT OZ OZA OZI P1 P10 P11 P12 P13 P14 P15 P16 P17 P18 P19 P2 P20 P21 P22 P23 P24 P25 P26 P27 P28 P29 P30 P31 P32 P33 P34 P35 P36 P37 P38 P39 P40 P41 P42 P43 P44 P45 P46 P47 P48 P49 P5 P50 P51 P52 P53 P54 P55 P56 P57 P58 P59 P60 P61 P62 P63 P64 P65 P66 P67 P68 P69 P70 P71 P72 P73 P74 P75 P76 P77 P78 P79 P80 P81 P82 P83 P84 P85 P86 P87 P88 P89 P90 P91 P92 P93 P94 P95 P96 P97 P98 P99 PAL PD PFL PGL PI PLA PO PQ PR PS PT PTD PTI PTL Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q3 QA QAN QB QR QT QTD QTI QTL QTR R1 R9 RH RM ROM RP RPM RPS RT S3 S4 SAN SCO SCR SEC SET SG SHT SIE SMI SQ SQR SR STC STI STK STL STN STW SW SX SYR T0 T3 TAH TAN TI TIC TIP TKM TMS TNE TP TPR TQD TRL TST TTS U1 U2 UA UB UC VA VLT VP W2 WA WB WCD WE WEB WEE WG WHR WM WSD WTT WW X1 YDK YDQ YRD Z11 ZP ZZ X43 X44 X1A X1B X1D X1F X1G X1W X2C X3A X3H X4A X4B X4C X4D X4F X4G X4H X5H X5L X5M X6H X6P X7A X7B X8A X8B X8C XAA XAB XAC XAD XAE XAF XAG XAH XAI XAJ XAL XAM XAP XAT XAV XB4 XBA XBB XBC XBD XBE XBF XBG XBH XBI XBJ XBK XBL XBM XBN XBO XBP XBQ XBR XBS XBT XBU XBV XBW XBX XBY XBZ XCA XCB XCC XCD XCE XCF XCG XCH XCI XCJ XCK XCL XCM XCN XCO XCP XCQ XCR XCS XCT XCU XCV XCW XCX XCY XCZ XDA XDB XDC XDG XDH XDI XDJ XDK XDL XDM XDN XDP XDR XDS XDT XDU XDV XDW XDX XDY XEC XED XEE XEF XEG XEH XEI XEN XFB XFC XFD XFE XFI XFL XFO XFP XFR XFT XFW XFX XGB XGI XGL XGR XGU XGY XGZ XHA XHB XHC XHG XHN XHR XIA XIB XIC XID XIE XIF XIG XIH XIK XIL XIN XIZ XJB XJC XJG XJR XJT XJY XKG XKI XLE XLG XLT XLU XLV XLZ XMA XMB XMC XME XMR XMS XMT XMW XMX XNA XNE XNF XNG XNS XNT XNU XNV XOA XOB XOC XOD XOE XOF XOK XOT XOU XP2 XPA XPB XPC XPD XPE XPF XPG XPH XPI XPJ XPK XPL XPN XPO XPP XPR XPT XPU XPV XPX XPY XPZ XQA XQB XQC XQD XQF XQG XQH XQJ XQK XQL XQM XQN XQP XQQ XQR XQS XRD XRG XRJ XRK XRL XRO XRT XRZ XSA XSB XSC XSD XSE XSH XSI XSK XSL XSM XSO XSP XSS XST XSU XSV XSW XSY XSZ XT1 XTB XTC XTD XTE XTG XTI XTK XTL XTN XTO XTR XTS XTT XTU XTV XTW XTY XTZ XUC XUN XVA XVG XVI XVK XVL XVN XVO XVP XVQ XVR XVS XVY XWA XWB XWC XWD XWF XWG XWH XWJ XWK XWL XWM XWN XWP XWQ XWR XWS XWT XWU XWV XWW XWX XWY XWZ XXA XXB XXC XXD XXF XXG XXH XXJ XXK XYA XYB XYC XYD XYF XYG XYH XYJ XYK XYL XYM XYN XYP XYQ XYR XYS XYT XYV XYW XYX XYY XYZ XZA XZB XZC XZD XZF XZG XZH XZJ XZK XZL XZM XZN XZP XZQ XZR XZS XZT XZU XZV XZW XZX XZY XZZ ', concat(' ', normalize-space(.), ' '))))">[CL-17]-Unit code MUST be coded according to the UN/ECE Recommendation
      20</assert>
    </rule>
    <rule flag="fatal" context="//D_0809">
      <assert flag="fatal" test="((. = 'application/pdf' or . = 'image/png' or . = 'image/jpeg' or . = 'text/csv' or . = 'application/vnd.openxmlformats-officedocument. spreadsheetml.sheet' or . = 'application/vnd.oasis.opendocument.spreadsheet'))">[CL-18]-For Mime code in attribute use MIMEMediaType.</assert>
    </rule>
  </pattern>
</schema>
