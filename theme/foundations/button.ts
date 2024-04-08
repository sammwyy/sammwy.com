import { defineStyleConfig } from '@chakra-ui/styled-system';

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    borderRadius: '8px',
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'xs',
    },
    md: {
      fontSize: 'sm',
    },
  },
  // The default size and variant values
  defaultProps: {
    colorScheme: 'purple',
    size: 'md',
    variant: 'solid',
  },
});

export default Button;
