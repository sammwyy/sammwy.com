import { AudioClip } from '@/components/layout/player';

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
  {
    name: '#LoveMe2',
    url: 'https://shared.sammwy.com/_personal_files_/music/%23Loveme2.mp3',
  },
  {
    name: 'DJ SPIZDIL - Я тебя не отдам!',
    url: 'https://shared.sammwy.com/_personal_files_/music/DJ%20SPIZDIL%20-%20%D0%AF%20%D1%82%D0%B5%D0%B1%D1%8F%20%D0%BD%D0%B5%20%D0%BE%D1%82%D0%B4%D0%B0%D0%BC%21.mp3',
  },
  {
    name: 'DONT STOP THE MUSIC',
    url: 'https://shared.sammwy.com/_personal_files_/music/DONT%20STOP%20THE%20MUSIC.mp3',
  },
  {
    name: 'Emmeid - Dj Spizdil - Nas Ne Dogonyat',
    url: 'https://shared.sammwy.com/_personal_files_/music/Emmeid%20-%20Dj%20Spizdil%20-%20Nas%20Ne%20Dogonyat%20%5BHardstyle%5D.mp3',
  },
  {
    name: 'Harris & Ford - 99 Luftballons',
    url: 'https://shared.sammwy.com/_personal_files_/music/Harris%20%26%20Ford%20-%2099%20Luftballons%20%28Hardstyle%20Remake%29.mp3',
  },
  {
    name: "I Don't Care",
    url: 'https://shared.sammwy.com/_personal_files_/music/I%20Don%27t%20Care.mp3',
  },
  {
    name: 'Imagine Dragons - Warriors',
    url: 'https://shared.sammwy.com/_personal_files_/music/Imagine%20Dragons%20-%20Warriors%20%28Jiyagi%20Frenchcore%20Bootleg%29.mp3',
  },
  {
    name: 'In The End',
    url: 'https://shared.sammwy.com/_personal_files_/music/In%20The%20End.mp3',
  },
  {
    name: 'Lieless - Nanana',
    url: 'https://shared.sammwy.com/_personal_files_/music/Lieless%20-%20Nanana.mp3',
  },
  {
    name: 'Lieless - портреты',
    url: 'https://shared.sammwy.com/_personal_files_/music/Lieless%20-%20%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82%D1%8B.mp3',
  },
  {
    name: 'Obsession',
    url: 'https://shared.sammwy.com/_personal_files_/music/Obsession.mp3',
  },
  {
    name: 'Atsuo - A3',
    url: 'https://shared.sammwy.com/_personal_files_/music/Atsuo%20-%20A3%20%281st%20version%29.mp3',
  },
  {
    name: 'Untitled',
    url: 'https://shared.sammwy.com/_personal_files_/music/Untitled.mp3',
  },
  {
    name: 'dreamloader - sky2k',
    url: 'https://shared.sammwy.com/_personal_files_/music/dreamloader%20-%20sky2k.mp3',
  },
  {
    name: 'dreamy weamy',
    url: 'https://shared.sammwy.com/_personal_files_/music/dreamy%20weamy.mp3',
  },
  {
    name: 'i am out of words 2 put in the title idno',
    url: 'https://shared.sammwy.com/_personal_files_/music/i%20am%20out%20of%20words%202%20put%20in%20the%20title%20idno.mp3',
  },
  {
    name: 'piercing light',
    url: 'https://shared.sammwy.com/_personal_files_/music/piercing%20light%20%28stryder%20bootleg%29.mp3',
  },
  {
    name: 't.A.T.u. - Ne Ver, Ne Boisia)',
    url: 'https://shared.sammwy.com/_personal_files_/music/t.A.T.u.%20-%20Ne%20Ver%2C%20Ne%20Boisia%20%28%20SWEEQTY%20hardstyle%20edit%20%29.mp3',
  },
  {
    name: 'uwu',
    url: 'https://shared.sammwy.com/_personal_files_/music/uwu.mp3',
  },
  {
    name: 'Пепел',
    url: 'https://shared.sammwy.com/_personal_files_/music/%D0%9F%D0%B5%D0%BF%D0%B5%D0%BB.mp3',
  },
  {
    name: '𝗥𝗥𝗗 𝗜𝗜𝗗 𝗖𝗧 𝗖𝗖𝗘',
    url: 'https://shared.sammwy.com/_personal_files_/music/%F0%9D%97%A5%F0%9D%97%98%F0%9D%97%97%20%F0%9D%97%9C%F0%9D%97%A6%20%F0%9D%97%A7%F0%9D%97%9B%F0%9D%97%98%20%F0%9D%97%96%F0%9D%97%A2%F0%9D%97%9F%F0%9D%97%A2%F0%9D%97%A8%F0%9D%97%A5%20%F0%9D%97%A2%F0%9D%97%99%20%F0%9D%97%A0%F0%9D%97%AC%20%F0%9D%97%9F%F0%9D%97%A2%F0%9D%97%A9%F0%9D%97%98.mp3',
  },
];

export default PLAYLIST;
