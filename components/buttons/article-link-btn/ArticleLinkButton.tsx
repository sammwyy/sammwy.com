import { Button, chakra } from '@chakra-ui/react';
import { FaGlobe, FaStore } from 'react-icons/fa';
import { IconType } from 'react-icons/lib/esm/iconBase';
import {
  SiApachemaven,
  SiAppstore,
  SiChocolatey,
  SiCurseforge,
  SiEpicgames,
  SiGithub,
  SiGogdotcom,
  SiGoogleplay,
  SiHumblebundle,
  SiItchdotio,
  SiModrinth,
  SiNpm,
  SiOrigin,
  SiPlaystation,
  SiSteam,
  SiWindows,
  SiXbox,
} from 'react-icons/si';

import { ArticleLink, LinkType, LinkVendor } from '@/lib/article';

const names: { [key in LinkVendor]: string } = {
  appstore: 'AppStore',
  builtbybit: 'BuiltByBit',
  chocolatey: 'Chocolatey',
  curseforge: 'CurseForge',
  epic: 'Epic Store',
  github: 'GitHub',
  gog: 'GoG',
  humble: 'HumbleBundle',
  itchio: 'Itch.io',
  maven: 'Maven',
  modrinth: 'ModRinth',
  npm: 'npmjs',
  origin: 'Origin',
  playstation: 'PlayStation',
  playstore: 'PlayStore',
  steam: 'Steam',
  windows_store: 'Windows Store',
  xbox: 'Xbox',
  custom: '',
};

const icons: { [key in LinkVendor]: IconType } = {
  appstore: SiAppstore,
  builtbybit: FaStore,
  chocolatey: SiChocolatey,
  curseforge: SiCurseforge,
  epic: SiEpicgames,
  github: SiGithub,
  gog: SiGogdotcom,
  humble: SiHumblebundle,
  itchio: SiItchdotio,
  maven: SiApachemaven,
  modrinth: SiModrinth,
  npm: SiNpm,
  origin: SiOrigin,
  playstation: SiPlaystation,
  playstore: SiGoogleplay,
  steam: SiSteam,
  xbox: SiXbox,
  windows_store: SiWindows,
  custom: FaGlobe,
};

const labels: { [key in LinkType]: string } = {
  buy: 'Buy on {vendor}',
  docs: 'View docs',
  download: 'Download on {vendor}',
  live_demo: 'Live demo',
  other: 'Visit {vendor}',
  source_code: 'Source code',
  view: 'View on {vendor}',
  website: 'Visit website',
};

export interface ArticleLinkButtonProps {
  link: ArticleLink;
}

export function ArticleLinkButton({ link }: ArticleLinkButtonProps) {
  const { type, vendor, url } = link;
  const Icon = icons[vendor];
  const name = names[vendor];
  const label = labels[type];
  const fullLabel = label.replace('{vendor}', name);
  const hasIcon = Icon !== undefined;

  return (
    <Button
      as={chakra.a}
      href={url}
      target={'_blank'}
      rel={'noopener noreferrer'}
      leftIcon={hasIcon ? <Icon /> : undefined}
      size={'xs'}
      mr={'10px'}
      mt={'10px'}
    >
      {fullLabel}
    </Button>
  );
}
