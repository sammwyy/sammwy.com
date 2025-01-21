import { Flex, Heading, Image } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface SectionTitleProps extends PropsWithChildren {
  icon?: string;
}

export function SectionTitle({ icon, children }: SectionTitleProps) {
  return (
    <Flex alignItems={'center'} gap={'10px'}>
      {icon && <Image src={icon} alt={children as string} width={'30px'} />}
      <Heading color={'inherit'} size={'lg'}>
        {children}
      </Heading>
    </Flex>
  );
}
