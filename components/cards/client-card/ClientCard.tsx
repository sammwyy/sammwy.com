import { chakra, Flex, Image, Link, Text } from '@chakra-ui/react';

import styles from './ClientCard.module.css';

export interface ClientCardProps {
  username: string;
  category: string;
  avatar: string;
  comment: string;
  link: string;
}

export function ClientCard({
  username,
  avatar,
  comment,
  link,
  category,
}: ClientCardProps) {
  return (
    <Link
      href={link}
      as={chakra.a}
      target={'_blank'}
      rel={'noopener noreferrer'}
    >
      <Flex className={styles.card}>
        <Image
          className={styles.avatar}
          src={avatar}
          alt={username + "'s Avatar"}
        />
        <Flex className={styles.data}>
          <Flex className={styles.header}>
            <Text className={styles.username}>{username}</Text>
          </Flex>
          <Text className={styles.category}>{category}</Text>
          <Text className={styles.comment}>{comment}</Text>
        </Flex>
      </Flex>
    </Link>
  );
}
