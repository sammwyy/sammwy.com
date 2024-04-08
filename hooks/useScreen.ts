import { useMediaQuery } from '@chakra-ui/react';

export type ScreenSize = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const BREAKPOINTS: Record<ScreenSize, string> = {
  desktop: '(min-width: 1200px)',
  laptop: '(min-width: 992px)',
  tablet: '(min-width: 768px)',
  mobile: '(min-width: 600px)',
};

const useScreen = () => {
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);
  const isLaptop = useMediaQuery(BREAKPOINTS.laptop);
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);

  if (isDesktop[0]) return 'desktop';
  if (isLaptop[0]) return 'laptop';
  if (isTablet[0]) return 'tablet';
  if (isMobile[0]) return 'mobile';
  else return 'mobile';
};

export default useScreen;
