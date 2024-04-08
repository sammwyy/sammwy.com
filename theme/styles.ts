import { StyleFunctionProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      fontFamily:
        'Roboto, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('white', 'gray.900')(props),
      lineHeight: 'base',
    },
  }),
};

export default styles;
