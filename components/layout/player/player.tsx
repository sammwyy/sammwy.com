'use client';

import { useColorMode } from '@chakra-ui/color-mode';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import * as MD from 'react-icons/md';

import useScreen from '@/hooks/useScreen';

import styles from './player.module.css';

interface AudioClip {
  name: string;
  url: string;
}

const PLAYLIST: AudioClip[] = [
  {
    name: 'Siinamota - Young Girl A',
    url: 'https://shared.sammwy.com/_personal_files_/music/Siinamota%20-%20Young%20Girl%20A%20%20%E5%B0%91%E5%A5%B3A.mp3',
  },
  {
    name: 'Inabakumori - Relayouter',
    url: 'https://shared.sammwy.com/_personal_files_/music/Inabakumori%20-%20Relayouter.mp3',
  },
  {
    name: 'Inabakumori - Yoyuyoku',
    url: 'https://shared.sammwy.com/_personal_files_/music/inabakumori%20-%20Yoyuyoku.mp3',
  },
  {
    name: 'Tada Jojo - BreakPoint',
    url: 'https://shared.sammwy.com/_personal_files_/music/Tada%20Jojo%20-%20BreakPoint.mp3',
  },
  {
    name: 'UYINX - Silly ourple',
    url: 'https://shared.sammwy.com/_personal_files_/music/UYINX%20-%20Silly%20ourple.mp3',
  },
];

const SHUFFLED = PLAYLIST.slice().sort(() => Math.random() - 0.5);

export function Player() {
  const screen = useScreen();
  const isSmall = screen == 'mobile' || screen == 'tablet';

  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? '#dddb' : '#333b';

  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<null | AudioClip>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(10);
  const [prevVolume, setPrevVolume] = useState(10);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPosition(time);
    }
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack === null) {
      setCurrentTrack(SHUFFLED[0]);
      return;
    }

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  const prevTrack = () => {
    let prevTrack = SHUFFLED.find((track) => track !== currentTrack);
    if (!prevTrack) {
      prevTrack = SHUFFLED[SHUFFLED.length - 1];
    }
    setCurrentTrack(prevTrack);
  };

  const nextTrack = () => {
    let nextTrack = SHUFFLED.find((track) => track !== currentTrack);
    if (!nextTrack) {
      nextTrack = SHUFFLED[0];
    }
    setCurrentTrack(nextTrack);
  };

  const onMetadataLoaded = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      audio.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    // Detect page scroll.
    const handleScroll = () => {
      setVisible(window.scrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && visible) {
      setPosition(audio.currentTime);
    }
  }, [visible]);

  useEffect(() => {
    if (currentTrack) {
      setPosition(0);
      audioRef.current?.load();
      audioRef.current?.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  return (
    <Flex className={styles.player}>
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onEnded={nextTrack}
        onLoadedMetadata={onMetadataLoaded}
        onTimeUpdate={(e) => {
          if (visible) {
            setPosition(e.currentTarget.currentTime);
          }
        }}
      />

      <Flex className={styles.controls}>
        {!isSmall && <Text>{currentTrack?.name || SHUFFLED[0].name}</Text>}

        {!isSmall && (
          <IconButton
            variant={'link'}
            icon={<MD.MdSkipPrevious />}
            aria-label="Prev song"
            onClick={prevTrack}
          />
        )}

        <IconButton
          variant={'link'}
          icon={playing ? <MD.MdPause /> : <MD.MdPlayArrow />}
          aria-label="Play/Pause"
          onClick={togglePause}
        />

        <IconButton
          variant={'link'}
          icon={<MD.MdSkipNext />}
          aria-label="Next song"
          onClick={nextTrack}
        />
      </Flex>

      <Flex className={styles.bar}>
        <Slider
          aria-label="music-player-slider"
          colorScheme="pink"
          max={duration || 9999}
          value={position}
          onChange={seekTo}
          className={styles['bar-slider']}
        >
          <SliderTrack bg={'gray.700'}>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>

      <Flex className={styles.volume}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MD.MdPlaylistPlay />}
            variant={'link'}
          />
          <MenuList className={styles['playlist-menu']} bg={bg} zIndex={9999}>
            {SHUFFLED.map((track, i) => (
              <MenuItem
                key={i}
                className={styles['playlist-item']}
                bg={
                  currentTrack?.url == track.url ? 'purple.500' : 'transparent'
                }
                onClick={() => setCurrentTrack(track)}
              >
                {track.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {!isSmall && (
          <>
            <IconButton
              variant={'link'}
              icon={volume == 0 ? <MD.MdVolumeOff /> : <MD.MdVolumeUp />}
              onClick={() => {
                if (volume === 0) {
                  setVolume(prevVolume);
                } else {
                  setPrevVolume(volume);
                  setVolume(0);
                }
              }}
              aria-label="Volume"
            />

            <Slider
              aria-label="music-player-volume"
              colorScheme="pink"
              defaultValue={volume}
              max={100}
              value={volume}
              onChange={(v) => {
                setPrevVolume(volume);
                setVolume(v);
              }}
              className={styles['volume-slider']}
            >
              <SliderTrack bg={'gray.700'}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </>
        )}
      </Flex>
    </Flex>
  );
}
