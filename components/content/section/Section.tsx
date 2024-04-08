import { Flex, FlexProps, useColorMode } from '@chakra-ui/react';

export function Section({ children, ...props }: FlexProps) {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? '#eeeb' : '#333b';

  return (
    <Flex bg={bg} backdropFilter={'blur(6px)'} borderRadius={'17px'} {...props}>
      {children}
    </Flex>
  );
}
