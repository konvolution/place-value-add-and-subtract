interface Taggable {
  __tag__?: string;
}

let nextTag = 1;

export function getTag(thing: unknown): string {
  const taggable = thing as Taggable;

  if (!taggable.__tag__) {
    taggable.__tag__ = "T" + nextTag;
    ++nextTag;
  }

  return taggable.__tag__;
}
