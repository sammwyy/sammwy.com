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
import 'katex/dist/katex.min.css';
import Markdown, { ReactRenderer } from 'marked-react';
import { ReactNode, useState } from 'react';
import Latex from 'react-latex-next';

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
        minimap: { enabled: false },
        readOnly: true,
        scrollBeyondLastLine: false,
        theme: 'vs-dark',
      }}
      height={height}
    />
  );
}

function MathRenderer({ children }: { children: string }) {
  return <Latex>{children}</Latex>;
}

const renderer: CustomReactRenderer = {
  code(code, language) {
    const asStr = code?.toString() || '';
    const nonRender = ['bash', 'shell', 'plaintext', 'sh', 'sql', ''];
    const isMath = language === 'math';

    // If the language is not defined, or is not supported, render as plaintext
    if (
      language === null ||
      language === undefined ||
      nonRender.includes(language)
    ) {
      return (
        <Code
          bg={'black'}
          color={'#ccc'}
          p={'15px 10px'}
          borderRadius={'7px'}
          w={'100%'}
          my={'5px'}
          overflowX={'auto'}
        >
          <pre>{asStr}</pre>
        </Code>
      );
    }

    // If the language is math, render as math
    if (isMath) {
      return <MathRenderer>{asStr}</MathRenderer>;
    }

    // Otherwise, render as code
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
    const isExternal = href.startsWith('http');

    return (
      <Link href={href} color={'purple.300'} isExternal={isExternal}>
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
      <ListItem fontFamily={'VictorMono, Arial'} fontSize={'13px'} my={'3px'}>
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
    const bg = colorMode === 'dark' ? '#181818' : '#e4e4e4';

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
    return <Tr whiteSpace={'pre-line'}>{children}</Tr>;
  },

  tableCell: (children, flags) => {
    return (
      <Th
        textAlign={flags.align || 'left'}
        fontWeight={flags.header ? 'bold' : 'normal'}
        color={flags.header ? 'purple.300' : 'inherit'}
        textTransform={'none'}
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
    <Markdown
      value={children}
      renderer={renderer}
      openLinksInNewTab={true}
      gfm={true}
    />
  );
}
