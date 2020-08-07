  interface Ack997Generator {
        /**
         * Segment and element delimiters
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function Delimiters
         * @type Delimiters
         */
        Delimiters: Delimiters | null;
        /**
         * String to insert between segments for formatting
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function SegmentSeparatorString
         * @type string
         */
        SegmentSeparatorString: string | null;
        /**
         * Char used to pad empty spaces
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function PaddingChar
         * @type number
         */
        PaddingChar: number;
        /**
         * Get/set the interchange control number
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function InterchangeControlNumber
         * @type number
         */
        InterchangeControlNumber: number;
        /**
         * Get/set the group control number
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function GroupControlNumber
         * @type number
         */
        GroupControlNumber: number;
        /**
         * Get/set the Transaction Set Control Number
         *
         * @instance
         * @public
         * @memberof Ack997Generator
         * @function TransactionSetControlNumber
         * @type number
         */
        TransactionSetControlNumber: number;
        /**
         * Generates a 997 Acknowledgement EDI file.
         *
         * @instance
         * @public
         * @this Ack997Generator
         * @memberof Ack997Generator
         * @param   {EDIValidator}    ediValidator    The edivalidator
         * @return  {EDIDocument}
         */
        generate(ediValidator: EDIValidator | null): EDIDocument | null;
    }
    interface Ack997GeneratorFunc extends Function {
        prototype: Ack997Generator;
        /**
         * Initializes a new instance of the {@link } class.
         *
         * @instance
         * @public
         * @this Ack997Generator
         * @memberof Ack997Generator
         * @return  {void}
         */
        new (): Ack997Generator;
    }
    declare var Ack997Generator: Ack997GeneratorFunc;