export function getURL() {
  return process.env.NODE_ENV == 'production'
    ? 'https://sammwy.com'
    : 'http://localhost:3000';
}

export function headerToChapterID(rawHeader: string) {
  return rawHeader.toLowerCase().replace(/ /g, '-');
}

function stripCodeBlocks(rawMarkdown: string) {
  return rawMarkdown.replace(/```[\s\S]*?```/g, '');
}

export function getMarkdownChapters(rawMarkdown: string) {
  const matches = stripCodeBlocks(rawMarkdown).match(/(?<=^#{2} ).*$/gm);
  const chapters = matches ? matches : [];
  return chapters.filter((ch) => ch && ch.toLowerCase);
}

export function randomPlushImage() {
  const images = ['1.jpg', '2.jpg', '3.jpg', '4.webp', '5.jpg'];
  const image = images[Math.floor(Math.random() * images.length)];
  return `/assets/plushes/${image}`;
}

// Return "hh:mm"
export function getGTMTime(offset: number) {
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const newDate = new Date(utc + 3600000 * offset);
  return newDate.toTimeString().slice(0, 5);
}
