import { defineStyleConfig } from '@chakra-ui/styled-system';

const Heading = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    color: 'purple.500',
    fontFamily: 'rainyhearts',
    lineHeight: '42px',
  },
  // The default size and variant values
  defaultProps: {
    colorScheme: 'purple',
  },
});

export default Heading;
