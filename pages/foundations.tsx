import {
  Button,
  Heading,
  HStack,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';

function ColorModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}

export default function Foundations() {
  return (
    <VStack gap={'25px'}>
      {/* Color ode */}
      <VStack>
        <Heading>Color Mode</Heading>
        <ColorModeSwitch />
      </VStack>

      {/* Typography */}
      <VStack>
        <Heading>Heading (Default)</Heading>
        <Heading size={'lg'}>Heading LG</Heading>
        <Heading size={'md'}>Heading MD</Heading>
        <Heading size={'sm'}>Heading SM</Heading>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          suscipit, eros sit amet ultricies fermentum, nunc nunc rutrum sem, nec
          fermentum nunc lacus sit amet libero.
        </Text>
      </VStack>

      {/* Buttons */}
      <VStack>
        <Heading>Buttons</Heading>
        <HStack>
          <Button>Solid</Button>
          <Button variant={'ghost'}>Ghost</Button>
          <Button variant={'outline'}>Outline</Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
