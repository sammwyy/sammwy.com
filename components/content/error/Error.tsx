import { Flex, Heading, Text } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export interface ErrorProps extends PropsWithChildren {
  title?: string;
}

export default function Error({ title, children }: ErrorProps) {
  return (
    <Flex
      width={'100%'}
      height={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      flexDir={'column'}
      gap={'10px'}
    >
      <Heading fontSize={'6xl'}>{title || 'An error ocurred!'}</Heading>
      <Text fontSize={'xl'}>{children}</Text>
    </Flex>
  );
}
