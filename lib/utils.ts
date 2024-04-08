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
  const matches = stripCodeBlocks(rawMarkdown).match(/(?<=^#{1,3} ).*$/gm);
  const chapters = matches ? matches : [];
  return chapters.filter((ch) => ch && ch.toLowerCase);
}

export function randomPlushImage() {
  const images = ['1.jpg', '2.jpg', '3.jpg', '4.webp', '5.jpg'];
  const image = images[Math.floor(Math.random() * images.length)];
  return `/assets/plushes/${image}`;
}
