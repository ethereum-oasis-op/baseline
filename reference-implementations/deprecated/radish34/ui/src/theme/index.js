import { createMuiTheme } from '@material-ui/core/styles';
import deepmerge from 'deepmerge';
import DefaultTheme from './default';
import CustomTheme from './custom';

const theme = deepmerge(DefaultTheme, CustomTheme);

export default createMuiTheme(theme);
