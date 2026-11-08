export interface Memory {
  image: string;
  alt: string;
  title: string;
  caption: string;
}

// Store Memories page photos in public/images/memories/.
export const MEMORIES: Memory[] = [
  { image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85', alt: 'Portrait of a woman smiling in warm light', title: 'Your lovely smile', caption: 'That lovely smile makes even an ordinary day feel special.' },
  { image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85', alt: 'Woman in a sunlit garden', title: 'A little sunshine', caption: 'A little sunshine, wherever you go.' },
  { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85', alt: 'Woman enjoying a bright day outdoors', title: 'My favorite view', caption: 'My favorite view is always you.' },
  { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85', alt: 'Couple sharing a quiet moment together', title: 'Right where I belong', caption: 'Right where I belong: beside you.' },
  { image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85', alt: 'Couple walking together in the sunshine', title: 'Every adventure', caption: 'Every adventure is better with us in it.' },
  { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85', alt: 'Couple holding hands outdoors', title: 'Your hand to hold', caption: 'Always your hand to hold.' },
];

// Store Things I Love page photos in public/images/things-i-love/.
export const THINGS_I_LOVE: Memory[] = [
  { image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85', alt: 'Portrait of a woman smiling', title: 'Your smile', caption: 'Your smile has a way of making my whole day brighter.' },
  { image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85', alt: 'Woman enjoying a sunny afternoon', title: 'Your kindness', caption: 'I love the gentle way you care for the people around you.' },
  { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85', alt: 'Woman enjoying a day outdoors', title: 'Your little quirks', caption: 'The little things that make you you are some of my favorite things.' },
  { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85', alt: 'Couple sharing a quiet moment', title: 'The way you love', caption: 'Being loved by you feels like finding my favorite place.' },
  { image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85', alt: 'Couple walking together', title: 'Your laughter', caption: 'Your laugh is one of my favorite sounds in the world.' },
  { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85', alt: 'Couple holding hands', title: 'Simply you', caption: 'I love who you are, in all the little and wonderful ways.' },
];
