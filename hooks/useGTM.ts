import { useEffect, useState } from 'react';

import { getGTMTime } from '@/lib/utils';

export default function useGTM(offset: number) {
  const [time, setTime] = useState<string>(getGTMTime(offset));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getGTMTime(offset));
    }, 1000);

    return () => clearInterval(interval);
  }, [offset]);

  return time;
}
