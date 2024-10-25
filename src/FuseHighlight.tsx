import React from 'react';
import { FuseResult, FuseResultMatch } from 'fuse.js';

interface HitItem {
  [key: string]: any;
}

interface FuseHighlightProps {
  hit: FuseResult<HitItem>;
  attribute: string;
}

const resolveAttribute = (obj: Record<string, any>, key: string): any =>
  key.split('.').reduce((prev, curr) => prev?.[curr], obj);

const highlight = (
  value: string,
  indices: number[][] = [],
  i = 1
): JSX.Element => {
  const pair = indices[indices.length - i];
  return !pair ? (
    <>{value}</>
  ) : (
    <>
      {highlight(value.substring(0, pair[0]), indices, i + 1)}
      <mark>{value.substring(pair[0], pair[1] + 1)}</mark>
      {value.substring(pair[1] + 1)}
    </>
  );
};

const FuseHighlight: React.FC<FuseHighlightProps> = ({ hit, attribute }) => {
  const matches: FuseResultMatch | undefined =
    typeof hit.item === 'string'
      ? hit.matches?.[0]
      : hit.matches?.find((m) => m.key === attribute);

  const validMatches = matches && matches.key ? matches : undefined;

  const fallback: string =
    typeof hit.item === 'string'
      ? hit.item
      : resolveAttribute(hit.item, attribute) || '';

  const indices = validMatches?.indices ? [...validMatches.indices] : undefined;

  return highlight(validMatches?.value || fallback, indices);
};

export default FuseHighlight;
