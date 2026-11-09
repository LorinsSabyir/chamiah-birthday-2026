export interface Memory {
  image: string;
  imagePosition?: string;
  alt: string;
  title: string;
  caption: string;
  footer?: string;
}

// Store Memories page photos in public/images/memories/.
export const MEMORIES: Memory[] = [
  {
    image:
      'images/memories/received_24524580027154504.jpeg',
    imagePosition: '50% 60%',
    alt: 'Chamiah S. Degorio',
    title: 'The first formal date we had',
    caption: 'I still remember the day at Victoria mall, we had experienced some of our first times.',
    footer: 'the first photobooth we had ♡',
  },
  {
    image:
      'images/memories/received_1304126667643763.jpeg',
    imagePosition: '50% 50%',
    alt: 'Chamiah S. Degorio',
    title: 'The random topics we shared',
    caption: 'The way you talk with exaggeration is so entertaining.',
    footer: 'making me listen even to the most mundane subjects ♡',
  },
  {
    image:
      'images/memories/20261005_154721.jpg',
    imagePosition: '50% 30%',
    alt: 'Chamiah S. Degorio',
    title: 'The little adventures we had',
    caption: 'Every moment with you is an adventure.',
    footer: 'making every meeting more exciting ♡',
  },
  {
    image:
      'images/memories/20261106_105505.jpg',
    imagePosition: '50% 50%',
    alt: 'Chamiah S. Degorio',
    title: 'The small dates we both experienced',
    caption: 'Spending time with you is always a joy.',
    footer: 'making every moment special ♡',
  },
  {
    image:
      'images/memories/IMG20231103160829.jpg',
    imagePosition: '50% 30%',
    alt: 'Chamiah S. Degorio',
    title: 'The first picture that I loved',
    caption: 'Taking cute pictures together.',
    footer: 'building memories ♡',
  },
];
