type PlaceholderImageOptions = { text: string; width: number; height: number };

export function placeholderImageUrl({ text, width, height }: PlaceholderImageOptions) {
  return `https://placehold.co/${width}x${height}/1a1a24/e8e6f0/png?text=${encodeURIComponent(text)}`;
}
