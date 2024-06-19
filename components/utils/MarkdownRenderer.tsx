'use client';

import {
  chakra,
  Code,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorMode,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import Markdown, { ReactRenderer } from 'marked-react';
import { ReactNode, useState } from 'react';

import { headerToChapterID } from '@/lib/utils';

type CustomReactRenderer = Partial<ReactRenderer>;

function CodeRenderer({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  const [value, setValue] = useState(children);
  const lines = value.split('\n').length + 1;
  const height = `${lines * 20}px`;

  return (
    <Editor
      value={value}
      onChange={(v) => setValue(v || '')}
      language={language}
      theme="vs-dark"
      options={{
        formatOnType: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        lineNumbers: 'on',
        lineHeight: 20,
      }}
      height={height}
    />
  );
}

const renderer: CustomReactRenderer = {
  code(code, language) {
    const asStr = code?.toString() || '';
    const nonRender = ['bash', 'shell', 'plaintext'];

    if (
      language === null ||
      language === undefined ||
      nonRender.includes(language)
    ) {
      return (
        <Code bg={'black'} color={'#ccc'} p={'10px'} borderRadius={'7px'}>
          <pre>{asStr}</pre>
        </Code>
      );
    }

    return (
      <CodeRenderer language={language || 'javascript'}>{asStr}</CodeRenderer>
    );
  },
  heading(text: ReactNode, level: number) {
    const sizes = ['4xl', '2xl', 'xl', 'lg', 'md'];
    const parts = text?.toString().split(' ') || [];
    const reactParts = [];

    const isEmoji = (text: string): boolean => {
      return text.match(/[\u{1F300}-\u{1F6FF}]/u) !== null;
    };

    for (const part of parts) {
      if (isEmoji(part)) {
        reactParts.push(part);
      } else {
        reactParts.push(
          <Text
            as={chakra.span}
            background={'var(--main-gradient)'}
            backgroundClip={'text'}
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {reactParts}
          </Text>,
        );
      }
    }

    return (
      <Heading
        fontSize={sizes[level - 1]}
        id={headerToChapterID(text?.toString() || '')}
        fontFamily={'rainyhearts'}
        mt={level == 2 ? '30px' : '0px'}
        alignItems={'center'}
      >
        {text}
      </Heading>
    );
  },
  image(src: string, alt: string) {
    const isRelative = src.startsWith('/') || src.startsWith('./');
    const fixedSrc = isRelative
      ? src
      : `/api/image?url=${encodeURIComponent(src)}`;
    return <Image src={fixedSrc} alt={alt} />;
  },
  link(href: string, text: string) {
    return (
      <Link href={href} color={'purple.300'} isExternal>
        {text}
      </Link>
    );
  },
  list: (children, ordered) => {
    return ordered ? (
      <OrderedList>{children}</OrderedList>
    ) : (
      <UnorderedList>{children}</UnorderedList>
    );
  },
  listItem: (text) => {
    return (
      <ListItem fontFamily={'VictorMono, Arial'} fontSize={'13px'}>
        {text}
      </ListItem>
    );
  },
  paragraph: (text) => {
    return (
      <Text fontFamily={'VictorMono, Arial'} fontSize={'13px'}>
        {text}
      </Text>
    );
  },
  table: (children) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { colorMode } = useColorMode();
    const bg = colorMode === 'dark' ? 'gray.800' : 'gray.100';

    return (
      <TableContainer>
        <Table variant="striped" bg={bg} borderRadius={'7px'}>
          {children}
        </Table>
      </TableContainer>
    );
  },
  tableHeader: (children) => {
    return <Thead>{children}</Thead>;
  },
  tableBody: (children) => {
    return <Tbody>{children}</Tbody>;
  },
  tableRow: (children) => {
    return <Tr>{children}</Tr>;
  },
  tableCell: (children, flags) => {
    return (
      <Th
        textAlign={flags.align || 'left'}
        fontWeight={flags.header ? 'bold' : 'normal'}
        color={flags.header ? 'purple.300' : 'inherit'}
      >
        {children}
      </Th>
    );
  },
};

export interface MarkdownRendererProps {
  children: string;
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <Markdown value={children} renderer={renderer} openLinksInNewTab={true} />
  );
}
