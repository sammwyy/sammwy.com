import { extendTheme } from '@chakra-ui/react';

import colors from './colors';
import components from './foundations';
import styles from './styles';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const Theme = extendTheme({
  colors,
  config,
  components,
  styles,
});

export default Theme;
