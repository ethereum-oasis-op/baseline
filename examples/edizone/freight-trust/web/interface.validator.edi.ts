  /**
     * Validates and loads EDI X12 and EDIFACT files
     *
     * @public
     * @class EDIValidator
     */
    interface EDIValidator {
        /**
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @type System.Collections.Generic.List$1
         */
        ValidatedTransactions: System.Collections.Generic.List$1<LightWeightSegment> | null;
        /**
         * If set to true element numbers are copied from the rules schema to DataElements for the validation output
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function CopyElementNumber
         * @type boolean
         */
        CopyElementNumber: boolean;
        /**
         * If set to true then when a required loop is not found EDI Validator will try to detect when an infinite loop scenario may be occurring
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function PreventInfiniteLoopWhileSearching
         * @type boolean
         */
        PreventInfiniteLoopWhileSearching: boolean;
        /**
         * If set the true then delimiters will be autodetected
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function AutoDetectDelimiters
         * @type boolean
         */
        AutoDetectDelimiters: boolean;
        /**
         * Event fired to perform a custom code condition check
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function addOnCodeCondition
         * @param   {EDIValidator.CodeConditionEvent}    value
         * @return  {void}
         */
        addOnCodeCondition(value: {(sender: any, e: CodeConditionEventArgs): void} | null): void;
        /**
         * Event fired to perform a custom code condition check
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function removeOnCodeCondition
         * @param   {EDIValidator.CodeConditionEvent}    value
         * @return  {void}
         */
        removeOnCodeCondition(value: {(sender: any, e: CodeConditionEventArgs): void} | null): void;
        /**
         * Event fired when the progress changes during validation
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function addProgressChanged
         * @param   {EDIValidator.GeneralEvent}    value
         * @return  {void}
         */
        addProgressChanged(value: {(progress: number): void} | null): void;
        /**
         * Event fired when the progress changes during validation
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function removeProgressChanged
         * @param   {EDIValidator.GeneralEvent}    value
         * @return  {void}
         */
        removeProgressChanged(value: {(progress: number): void} | null): void;
        /**
         * Event fired when validation is complete
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function addValidationCompleted
         * @param   {EDIValidator.ValidationCompletedEvent}    value
         * @return  {void}
         */
        addValidationCompleted(value: {(sender: any, e: ValidationEventsArgs): void} | null): void;
        /**
         * Event fired when validation is complete
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function removeValidationCompleted
         * @param   {EDIValidator.ValidationCompletedEvent}    value
         * @return  {void}
         */
        removeValidationCompleted(value: {(sender: any, e: ValidationEventsArgs): void} | null): void;
        /**
         * Event fired when validation has started
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function addValidationStarted
         * @param   {EDIValidator.ValidationStartedEvent}    value
         * @return  {void}
         */
        addValidationStarted(value: {(sender: any): void} | null): void;
        /**
         * Event fired when validation has started
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @function removeValidationStarted
         * @param   {EDIValidator.ValidationStartedEvent}    value
         * @return  {void}
         */
        removeValidationStarted(value: {(sender: any): void} | null): void;
        /**
         * If set to true then when a required loop is not found EDI Validator will try to detect when an infinite loop scenario may be occurring
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function MaxErrorsBeforeThrowingException
         * @type System.Int64
         */
        MaxErrorsBeforeThrowingException: System.Int64;
        /**
         * If set to true then when a loop is unrecognized a search will be made if to see if a loop like that even exists in the EDI rules, if not an error will be generated
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function TrackDownUnrecognizedLoops
         * @type boolean
         */
        TrackDownUnrecognizedLoops: boolean;
        /**
         * String to ignore at between segment delimiters
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function TrimString
         * @type string
         */
        TrimString: string | null;
        /**
         * Treat all warnings as errors
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function TreatWarningsAsErrors
         * @type boolean
         */
        TreatWarningsAsErrors: boolean;
        /**
         * EDI data to validate. EDI data can also be specified from a file using the EDIFile property
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function EDIDataString
         * @type string
         */
        EDIDataString: string | null;
        /**
         * Check for trailing empty elements and trailing empty composite elements
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function CheckForEmptyTrailingElements
         * @type boolean
         */
        CheckForEmptyTrailingElements: boolean;
        /**
         * Check that elements are within their minimum and maximum required lengths
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function CheckMinMaxRequirements
         * @type boolean
         */
        CheckMinMaxRequirements: boolean;
        /**
         * Check that elements values are correct for their specified data types
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function CheckDataTypeRequirements
         * @type boolean
         */
        CheckDataTypeRequirements: boolean;
        /**
         * Used to specify the type of EDI file to be validated
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function EDIFileType
         * @type FileType
         */
        EDIFileType: FileType;
        /**
         * Shows detailed information about the validation process. DEBUGGING PURPOSES ONLY, validation will be a slower
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function DebugMode
         * @type boolean
         */
        DebugMode: boolean;
        /**
         * Load EDI data while validating.  After validation is complete the EDI data can be accessed the the EDIDocument property
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function LoadValidatedData
         * @type boolean
         */
        LoadValidatedData: boolean;
        /**
         * Check whether the EDI data or file has passed validation. Use this property after calling the Validate() method
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function Passed
         * @type boolean
         */
        Passed: boolean;
        /**
         * EDI Lite document available after validation.  Validation must pass or this object will be null
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function EDILightWeightDocument
         * @type EDILightWeightDocument
         */
        EDILightWeightDocument: EDILightWeightDocument | null;
        /**
         * Number of lines in the EDI file
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function NumberOfLines
         * @type number
         */
        NumberOfLines: number;
        /**
         * EDI Rules Reader used to read in EDI rules for validation
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function EDIRulesReader
         * @type EDIRulesReader
         */
        EDIRulesReader: EDIRulesReader | null;
        /**
         * Gets or sets the EDI rules file data. Each line must end with a return character
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function EDIRulesFileData
         * @type string
         */
        EDIRulesFileData: string | null;
        /**
         * Data loaded from the EDI file when property LoadValidatedData is set to true. Available after validation
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function DataLoop
         * @type LightWeightLoop
         */
        DataLoop: LightWeightLoop | null;
        /**
         * Errors encountered while validating EDI file. Available after validation
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function Errors
         * @type System.Collections.Generic.List$1
         */
        Errors: System.Collections.Generic.List$1<EDIError> | null;
        /**
         * Warnings encountered while validating EDI file. Available after validation
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function Warnings
         * @type System.Collections.Generic.List$1
         */
        Warnings: System.Collections.Generic.List$1<EDIWarning> | null;
        /**
         * Numbers of errors in EDI file. Available after validation
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function ErrorCount
         * @type number
         */
        ErrorCount: number;
        /**
         * Numbers of warnings in EDI file. Available after validation
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function WarningCount
         * @type number
         */
        WarningCount: number;
        /**
         * EDI files lines available after validation.
         *
         * @instance
         * @public
         * @readonly
         * @memberof EDIValidator
         * @function EDIFileLines
         * @type Array.<string>
         */
        EDIFileLines: string[] | null;
        /**
         * EDI file delimiters
         *
         * @instance
         * @public
         * @memberof EDIValidator
         * @function Delimiters
         * @type Delimiters
         */
        Delimiters: Delimiters | null;
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {number}    lineNum
         * @return  {void}
         */
        /**
         * This procedures sets the usage of a segment based on the values or existance of
         another segments
         *
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}    segment
         * @return  {Usage}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}    segment
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}    segment       
         * @param   {boolean}        throwError
         * @return  {void}
         */
        /**
         * This procedures sets the usage of a segment elements based on the values or existance of
         another segments or elements
         *
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}    segment
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           segment    
         * @param   {LightWeightSegment}    currSeg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}                                sch_seg                    
         * @param   {LightWeightElement}                         elem                       
         * @param   {DataElement}                                sch_elem                   
         * @param   {string}                                     segmentName                
         * @param   {number}                                     elementOrdinal             
         * @param   {System.Collections.Generic.Dictionary$2}    elementPositionCounters
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}                                sch_seg                    
         * @param   {LightWeightElement}                         compositeElement           
         * @param   {DataElement}                                sch_elem                   
         * @param   {string}                                     segmentName                
         * @param   {number}                                     elementOrdinal             
         * @param   {System.Collections.Generic.Dictionary$2}    elementPositionCounters
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           sch_seg                          
         * @param   {string}                segmentName                      
         * @param   {number}                elementOrdinal                   
         * @param   {DataElement}           schema_composite_parent_elem     
         * @param   {LightWeightElement}    current_composite_parent_elem    
         * @param   {number}                i
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}                          sch_seg                         
         * @param   {System.Collections.Generic.List$1}    elems                           
         * @param   {string}                               segmentName                     
         * @param   {number}                               elementOrdinal                  
         * @param   {DataElement}                          schema_composite_parent_elem    
         * @param   {number}                               i
         * @return  {void}
         */
        /**
         * @instance
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {number}                  lineNumber                 
         * @param   {string}                  loopName                   
         * @param   {string}                  segmentName                
         * @param   {number}                  elementOrdinal             
         * @param   {number}                  compositeElementOrdinal    
         * @param   {EDIValidationMessage}    message                    
         * @param   {string}                  description                
         * @param   {string}                  position                   
         * @param   {DataSegment}             seg_schema
         * @return  {void}
         */
        /**
         * @instance
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {EDIError}    newError           
         * @param   {boolean}     checkForMaximum
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {number}                  lineNumber                 
         * @param   {string}                  loopName                   
         * @param   {string}                  segmentName                
         * @param   {number}                  elementOrdinal             
         * @param   {number}                  compositeElementOrdinal    
         * @param   {EDIValidationMessage}    message                    
         * @param   {string}                  description                
         * @param   {string}                  position                   
         * @param   {DataSegment}             segSchema
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}                         curr_seg                   
         * @param   {DataSegment}                                sch_seg                    
         * @param   {System.Collections.Generic.Dictionary$2}    elementPositionCounters    
         * @param   {boolean}                                    addAlreadyFoundValues
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}                         curr_seg                   
         * @param   {DataSegment}                                sch_seg                    
         * @param   {System.Collections.Generic.Dictionary$2}    elementPositionCounters    
         * @param   {boolean}                                    addAlreadyFoundValues
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements    
         * @param   {DataSegment}                                sch_seg          
         * @param   {System.Collections.Generic.List$1}          selfRules
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements    
         * @param   {DataSegment}                                sch_seg          
         * @param   {System.Collections.Generic.List$1}          selfRules
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements     
         * @param   {DataSegment}                                sch_seg           
         * @param   {System.Collections.Generic.List$1}          selfRules         
         * @param   {number}                                     elementOrdinal
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements     
         * @param   {DataSegment}                                sch_seg           
         * @param   {System.Collections.Generic.List$1}          selfRules         
         * @param   {number}                                     elementOrdinal
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           sch_seg     
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {number}                i
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           sch_seg           
         * @param   {LightWeightSegment}    curr_seg          
         * @param   {string}                repeatingValue    
         * @param   {number}                i
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements             
         * @param   {DataSegment}                                sch_seg                   
         * @param   {System.Collections.Generic.List$1}          elementPairConstraints    
         * @param   {LightWeightSegment}                         curr_seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements                    
         * @param   {DataSegment}                                sch_seg                          
         * @param   {System.Collections.Generic.List$1}          elementConditionalConstraints    
         * @param   {LightWeightSegment}                         curr_seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements                   
         * @param   {DataSegment}                                sch_seg                         
         * @param   {System.Collections.Generic.List$1}          elementRequirmentConstraints    
         * @param   {LightWeightSegment}                         curr_seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements                        
         * @param   {DataSegment}                                sch_seg                              
         * @param   {System.Collections.Generic.List$1}          elementListConditionalConstraints    
         * @param   {LightWeightSegment}                         curr_seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {System.Collections.Generic.Dictionary$2}    foundElements                  
         * @param   {DataSegment}                                sch_seg                        
         * @param   {System.Collections.Generic.List$1}          elementExclusionConstraints    
         * @param   {LightWeightSegment}                         curr_seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * Only check the loopValidation index element
         *
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}                 curr_seg           
         * @param   {DataSegment}                        sch_seg            
         * @param   {System.Collections.Generic.List}    procedureErrors    
         * @param   {boolean}                            forgive
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    curr_seg    
         * @param   {DataSegment}           sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {string}     segmentName
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  loop                
         * @param   {number}                segmentNumber       
         * @param   {LightWeightSegment}    curr_Segment        
         * @param   {DataSegment}           sch_seg             
         * @param   {DataSegment}           duplicateSegment
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  loop               
         * @param   {number}                segmentNumber      
         * @param   {LightWeightSegment}    segment            
         * @param   {boolean}               ggg                
         * @param   {DataSegment}           previousSegment
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}    sch_seg
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  previousLoop       
         * @param   {LightWeightSegment}    segment            
         * @param   {DataSegment}           previousSegment
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  previousLoop           
         * @param   {LightWeightSegment}    segment                
         * @param   {System.Int32}          previousLoopCounter
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  previousLoop    
         * @param   {LightWeightSegment}    segment         
         * @param   {DataSegment}           seg_schema
         * @return  {boolean}
         */
        /**
         * Resets all validation variables.  This method is automatically everytime the Validate method
         is called.
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        resetValidation(): void;
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           segSchema     
         * @param   {LightWeightSegment}    curr_Seg      
         * @param   {Loop}                  schemaLoop
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {LightWeightSegment}    cs
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {LightWeightSegment}    cs
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {LightWeightSegment}    cs
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {LightWeightSegment}    cs
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                                       schemaLoop                 
         * @param   {LightWeightLoop}                            parentDataLoop             
         * @param   {System.Collections.Generic.Dictionary$2}    elementPositionCounters
         * @return  {void}
         */
        /**
         * Validates the contents of an EDI Document
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {EDIDocument}    document    document to validate
         * @return  {void}
         */
        validate$1(document: EDIDocument | null): void;
        /**
         * Validates the contents of an EDILightWeightDocument
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {EDILightWeightDocument}    document    document to validate
         * @return  {void}
         */
        validate$2(document: EDILightWeightDocument | null): void;
        /**
         * Validate the EDI file
         *
         * @instance
         * @public
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        validate(): void;
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightLoop}                          thisDataLoop               
         * @param   {System.Collections.Generic.List}          missingRequiredSegments    
         * @param   {System.Collections.Generic.Dictionary}    missingSegmentErrors
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {LightWeightSegment}    currSeg
         * @return  {number}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}                  schemaLoop    
         * @param   {DataSegment}           seg_Schema    
         * @param   {LightWeightSegment}    curr_Seg      
         * @param   {number}                lineNumber
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    currentSegment    
         * @param   {DataSegment}           schemaSegment
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    currentSegment    
         * @param   {DataSegment}           schemaSegment
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightElement}    currentElement    
         * @param   {DataElement}           schemaElement
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           sch_seg           
         * @param   {LightWeightElement}    currentElement    
         * @param   {DataElement}           schemaElement     
         * @param   {number}                elementOrdinal
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {string}     segmentName
         * @return  {boolean}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {LightWeightSegment}    currentSegment    
         * @param   {Loop}                  schemaLoop        
         * @param   {DataSegment}           schemaSegment
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           segSchema    
         * @param   {LightWeightSegment}    curr_Seg
         * @return  {void}
         */
        /**
         * Responsible for checking the values of elements and composite elements to
         make sure that they are correct. 
         HOW SUMMARY VALUES ARE CHECKED:
         1. Since summary fields (balance fields) only apply in the same loop, the summary
            parent element is always encountered first.  Since this is the first occurrence of the parent
            element, its value is saved in the summaryElementValidationInfo collection's SummaryElementValue property as well
            as other information.
         2. Next the 'summarychild' elements are encountered.  We first check who its parent elements are.
            We get them from the summaryElementValidationInfo collection.  The
            summarychild's element value is added to the aggregate value of the summaryElementValidationInfo
            collection.  This aggregate value will later be used to check if the values of all the 'summaryChild' element
            encountered are equal to the SummaryElementValue saved when the 'SummaryParent' was initially encountered.
         *
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           segSchema    
         * @param   {LightWeightSegment}    curr_Seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {DataSegment}           segSchema    
         * @param   {LightWeightSegment}    curr_Seg
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {string}    message
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}    loop
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}               loop        
         * @param   {LightWeightLoop}    dataLoop
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}               loop        
         * @param   {LightWeightLoop}    dataLoop
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}    loop
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {Loop}           currentLoop    
         * @param   {DataSegment}    start
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {void}
         */
        /**
         * @instance
         * @private
         * @this EDIValidator
         * @memberof EDIValidator
         * @return  {number}
         */
        /**
         * @instance
         * @this EDIValidator
         * @memberof EDIValidator
         * @param   {CodeConditionEventArgs}    e
         * @return  {void}
         */
     }