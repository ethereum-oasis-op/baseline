import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SplitPane from "react-split-pane";
import { WithMessageBus, WithQuery } from "common-tools/index";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ReactJson from "react-json-view";
import { TemplateEditor, TemplateEditorChannels } from "./TemplateEditor";
import { DataEditor, DataEditorChannels } from "./DataEditor";
import { withSnackbar } from "notistack";

const styles = (theme) => ({
  root: {
    display: "grid",
    height: "100vh",
    width: "100vw",
    gridTemplateRows: "max-content 1fr",
    gridAutoColumns: "1fr",
    gridTemplateAreas: '"topBar" "body"',
    position: "relative",
    boxSizing: "border-box",
  },
  topBar: {
    gridArea: "topBar",
    position: "relative",
  },
  body: {
    gridArea: "body",
    position: "relative",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuOption: {
    flex: 1,
  },
  menuOptionText: {
    color: theme.palette.primary.contrastText,
  },
  menuOptionFocused: {},
  menuOptionOutline: {
    "&$cssFocused $notchedOutline": {
      borderColor: `${theme.palette.primary.contrastText} !important`,
    },
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: `${theme.palette.primary.contrastText} !important`,
  },
  title: {
    flex: 4,
  },
});

export class ParseDemoPlain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Template: defaultTemplate,
      Data: "",
      VSplit: 0,
      HSplit: 0,
      Output: {},
      MessageId: "271",
    };
  }

  onNewMessage = (message) => {
    // eslint-disable-next-line default-case
    switch (message.Name) {
      case DataEditorChannels.DataUpdate:
      case TemplateEditorChannels.TemplateUpdate:
        this.updateOuptputPreview();
        break;
    }
  };

  updateOuptputPreview = () => {
    const { ParseEDI, enqueueSnackbar, displayRuleMessages } = this.props;
    const { Data, Template, MessageId } = this.state;

    ParseEDI({ EDI: Data, Script: Template, MessageId: MessageId })
      .then(({ data }) => {
        try {
          this.setState({
            Output: data,
          });
          enqueueSnackbar("Script Parsed", {
            variant: "success",
          });
        } catch (jerr) {
          this.setState({
            Output: {
              Error: jerr.message,
            },
          });
          enqueueSnackbar("Script Parse Failed", {
            variant: "error",
          });
        }
      })
      .catch(displayRuleMessages);
  };

  onSplitResize = (name, newSize) => {
    this.setState({
      [`${name}Split`]: newSize || 0,
    });
  };

  onMessageIdChange = (event) => {
    this.setState({
      MessageId: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      Template,
      VSplit = 0,
      HSplit = 0,
      Data,
      Output,
      MessageId,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.topBar}>
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                (X12POC) React/Node EDI Parser
              </Typography>
              <FormControl
                color="primary"
                size="small"
                className={classes.menuOption}
                variant="outlined"
              >
                <InputLabel className={classes.menuOptionText} id="msgId-lab">
                  Message Id
                </InputLabel>
                <Select
                  labelId="msgId-lab"
                  id="msdId"
                  label="Message Id"
                  value={MessageId}
                  onChange={this.onMessageIdChange}
                  className={classes.menuOptionText}
                  InputProps={{
                    classes: {
                      root: classes.menuOptionOutline,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                >
                  <MenuItem value="270">270</MenuItem>
                  <MenuItem value="271">271</MenuItem>
                  <MenuItem value="835">835</MenuItem>
                </Select>
              </FormControl>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.body}>
          <SplitPane
            pane1Style={{ overflow: "auto" }}
            split="vertical"
            onDragFinished={this.onSplitResize.bind(this, "V")}
            minSize={"100px"}
            defaultSize={"50%"}
          >
            <ReactJson src={Output} />
            <SplitPane
              split="horizontal"
              onDragFinished={this.onSplitResize.bind(this, "H")}
              minSize={"100px"}
              defaultSize={"50%"}
            >
              <TemplateEditor
                value={Template}
                splitSize={VSplit + HSplit}
                onChange={(val) => {
                  this.setState({ Template: val });
                }}
              />
              <DataEditor
                value={Data}
                splitSize={VSplit + HSplit}
                onChange={(val) => {
                  this.setState({ Data: val });
                }}
              />
            </SplitPane>
          </SplitPane>
        </div>
      </div>
    );
  }
}

export const ParseDemo = compose(
  withSnackbar,
  withStyles(styles),
  WithQuery({
    stateKey: "ParseDemo",
    actions: [
      {
        url: "/Services/EDI/Parse",
        prop: "ParseEDI",
      },
    ],
  }),
  WithMessageBus({
    channels: [
      DataEditorChannels.DataUpdate,
      TemplateEditorChannels.TemplateUpdate,
    ],
  })
)(ParseDemoPlain);

export default ParseDemoPlain;

const defaultTemplate = `

const ST = this.queryFirst("ST01")

// this.data.loops = this.edi.getSegmentLoops()

if (ST !== '271') {
    this.AddMessageError(\`Document type is not 271.  ST01 is '\${ST}\`)
    return
}

const payerData = this.queryAll("HL+20-NM1:NM101['PR']", 2)

this.data.Payers = _.map(payerData, (p) => {
    return {
        Name: p[3],
        Id: p[9]
    }    
})

const providerData = this.queryAll("HL+20+21-NM101", 2)

this.data.Providers = _.map(providerData, (p) => {
    return {
        Name: p[3],
        Id: p[9]
    }    
})

const si = _.groupBy(this.queryAll("FORSEGLOOP(ISA.GS.ST=271[1].HL=22[3].NM1=IL[1])=>*", 2), (sd) => sd[0])
const s = {}

if (si.NM1) {
    s.Id = si.NM1[0][9]
    s.FirstName = si.NM1[0][4]
    s.LastName = si.NM1[0][3]
    s.MiddleInitial = si.NM1[0][5]
}

if (si.N3) {
    _.set(s, 'Address.Street', si.N3[0][1])
}

if (si.N4) {
    _.set(s, 'Address.City', si.N4[0][1])
    _.set(s, 'Address.State', si.N4[0][1])
    _.set(s, 'Address.ZipCode', si.N4[0][3])
}

if (si.DMG) {
    s.Gender = si.DMG[0][3]
    s.DOB = moment(si.DMG[0][2], 'YYYYMMDD').format('MM/DD/YYYY') 
}

if (si.INS) {
    _.set(s, 'Insurance.Relationship', si.INS[0][2])
    _.set(s, 'Insurance.ChangeTypeCode', si.INS[0][3])
    _.set(s, 'Insurance.ChangeElement', si.INS[0][4])
}

if (si.DTP) {
    _.set(s, 'Insurance.DateTypeCode', si.DTP[0][1])
    _.set(s, 'Insurance.DateType', this.translate('DTP01', si.DTP[0][1]))
    if (si.DTP[0][2] === 'D8') {
        _.set(s, 'Insurance.DateStart', moment(si.DTP[0][3], 'YYYYMMDD').format('MM/DD/YYYY'))
    } else if (si.DTP[0][2] === 'RD8') {
        const dateParts = _.split(si.DTP[0][3], '-')
        if (dateParts.length === 2) {
            _.set(s, 'Insurance.DateStart', moment(dateParts[0], 'YYYYMMDD').format('MM/DD/YYYY'))
            _.set(s, 'Insurance.DateEnd', moment(dateParts[1], 'YYYYMMDD').format('MM/DD/YYYY'))
        } else {
            _.set(s, 'Insurance.DateError', 'BadDates!')
        }
    }
}


this.data.Subscriber = s

const eobs = _.groupBy(
        this.queryAll(
            "FORSEGLOOP(^ISA\\\\.GS\\\\.ST=271\\\\[.*\\\\]\\\\.HL=22\\\\[.*\\\\]\\\\.NM1=IL\\\\[.*\\\\]\\\\.EB=.)=>*",
            4,
            (s) =>  ({
                loopPath: s.segment.loopPath,
                values: _.concat((s.segment || {}).tag, _.map((s.segment || {}).elements, (e) => e.value))
            })
        ), 
        (ebset) => {
            return _.split(ebset.loopPath, '.')[5]
        }
    )

const eobList = []
const eobsKeys = _.keys(eobs)

_.forEach(eobsKeys, (eobsKey) => {
    let eob = eobs[eobsKey]
    let newEOB = {}
    
    _.set(newEOB, 'EOBInfoCode', this.translate('EB01', eob[0].values[1]))
    
    if (eob[0].values[4]) {
      _.set(newEOB, 'Insurance', this.translate('EB04', eob[0].values[4]) )  
    }
    
    if (eob[0].values[5]) {
      _.set(newEOB, 'Plan', this.translate('EB05', eob[0].values[5]) )  
    }
    
    if (eob[0].values[6]) {
      _.set(newEOB, 'TimePeriod', this.translate('EB06', eob[0].values[6]) )  
    }
    
    if (eob[0].values[7]) {
      _.set(newEOB, 'Amount', eob[0].values[7])  
    }
    
    if (eob[0].values[8]) {
      _.set(newEOB, 'Percentage', eob[0].values[8])  
    }
    
    if (eob[0].values[9]) {
      _.set(newEOB, 'QuantityType', this.translate('EB09', eob[0].values[9]))  
    }
    
    if (eob[0].values[10]) {
      _.set(newEOB, 'Quantity', this.translate('EB10', eob[0].values[10]))  
    }
    
    if (eob[0].values[3]) {
        let services = _.split(eob[0].values[3], '^')    
        _.forEach(services, (service, index) => {
            if (service) {
                _.set(newEOB, \`Services[\${index}]\`, this.translate('EB03', service) )  
            }
        })
    }
    
    if (eob[0].values[13]) {
        let procedures = _.split(eob[0].values[13], '^')    
        _.forEach(procedures, (procedure, index) => {
            if (procedure) {
                let details = _.split(procedure, '|')
                
                if (details[0]) {
                    _.set(newEOB, \`Procedures[\${index}].Type\`, details[0] )      
                }
                
                if (details[1]) {
                    _.set(newEOB, \`Procedures[\${index}].Description\`, this.translate('HCPCS', details[1]) )      
                }
            }
        })
    }
    
    if (eob[0].values[11]) {
      _.set(newEOB, 'AuthorizationRequired', this.translate('EB11', eob[0].values[11]))  
    }

    if (eob[0].values[12]) {
      _.set(newEOB, 'InPlanNetwork', this.translate('EB12', eob[0].values[12]))  
    }
    
    if (eob.length > 1) {
        let dates = []
        let schedules = []
        let refs = []
        let messages = []
        let entities = []
        
        for (let i = 1; i <= eob.length - 1; i++) {
            
            switch (eob[i].values[0]) {
                case 'DTP':
                    let newDTP = {
                        Type: this.translate('DTP01', eob[i].values[1])
                    }
                    
                    if (eob[i].values[2] === 'D8') {
                        newDTP.Start = moment(eob[i].values[3], 'YYYYMMDD').format('MM/DD/YYYY')
                    } else if (eob[i].values[2] === 'RD8') {
                        const dateParts = _.split(eob[i].values[3], '-')
                        if (dateParts.length === 2) {
                            newDTP.Start = moment(dateParts[0], 'YYYYMMDD').format('MM/DD/YYYY')
                            newDTP.End = moment(dateParts[1], 'YYYYMMDD').format('MM/DD/YYYY')
                        } else {
                            newDTP.Error = 'BadDates!'
                        }
                    }
                    dates.push(newDTP)
                    break
                    
                case 'HSD':
                    let newHSD = {
                        QuantityType: this.translate('HSD01', eob[i].values[1]),
                        Quantity: eob[i].values[2],
                        Unit: this.translate('HSD03', eob[i].values[3]),
                        SampleSize: eob[i].values[4],
                        PeriodType: this.translate('HSD05', eob[i].values[5]),
                        Period: eob[i].values[6],
                        DeliveryFrequency: this.translate('HSD07', eob[i].values[7]),
                        DeliveryTime: this.translate('HSD08', eob[i].values[8])
                    }
                    schedules.push(newHSD)
                    break
                    
                case 'NM1':
                    let newNM1 = {
                        Type: this.translate('NM101', eob[i].values[1]),
                        PersonTypeCode: eob[i].values[2],
                        PersonType: this.translate('NM102', eob[i].values[2]),
                        IdType: this.translate('NM108', eob[i].values[8]),
                        Id: eob[i].values[9],
                        Period: eob[i].values[6],
                        DeliveryFrequency: this.translate('HSD07', eob[i].values[7]),
                        DeliveryTime: this.translate('HSD08', eob[i].values[8])
                    }
                    if (eob[i].values[2] === 1) {
                        newNM1.FName = eob[i].values[3]
                        newNM1.LName = eob[i].values[4]
                        newNM1.MName = eob[i].values[5]
                        newNM1.SName = eob[i].values[7]
                    } else {
                        newNM1.Name = eob[i].values[3]
                    }
                    entities.push(newNM1)
                    break
                    
                case 'REF':
                    let newREF = {
                        Type: this.translate('REF01', eob[i].values[1]),
                        Id: eob[i].values[2],
                        Description: eob[i].values[3]
                    }
                    refs.push(newREF)
                    break
                case 'MSG':
                    messages.push(eob[i].values[1])
                    break
            }
            
        }
        
        if (dates.length > 0) {
            newEOB.Dates = dates
        }
        if (schedules.length > 0) {
            newEOB.Schedules = schedules
        }
        if (refs.length > 0) {
            newEOB.References = refs
        }
        if (messages.length > 0) {
            newEOB.Messages = messages
        }
        if (entities.length > 0) {
            newEOB.Entities = entities
        }
    }
    
    

    eobList.push(newEOB)
})

this.data.Subscriber.EOBs = eobList
`;
