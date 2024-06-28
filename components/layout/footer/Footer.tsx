import { PropsWithChildren } from 'react';

import Section from '@/components/content/section';

export function Footer(props: PropsWithChildren) {
  return (
    <Section
      borderRadius={'0'}
      w={'100%'}
      p={'5px 20px'}
      position={'absolute'}
      bottom={'0'}
    >
      {props.children}
    </Section>
  );
}
