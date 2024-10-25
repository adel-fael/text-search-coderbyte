import Fuse from 'fuse.js';
import type { FuseResult, IFuseOptions } from 'fuse.js';
import { useCallback, useMemo, useState } from 'react';
import { debounce } from 'throttle-debounce';

export type ItemType = Record<string, any>;

export interface UseFuseOptions<T> extends IFuseOptions<T> {
  limit?: number;
  matchAllOnEmptyQuery?: boolean;
}

export interface UseFuseReturn<T> {
  hits: Array<FuseResult<T>>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const useFuse = <T extends ItemType>(
  list: T[],
  options: UseFuseOptions<T>
): UseFuseReturn<T> => {
  const [query, updateQuery] = useState<string>('');

  const { limit, matchAllOnEmptyQuery, ...fuseOptions } = options;

  const fuse = useMemo(
    () => new Fuse<T>(list, fuseOptions),
    [list, fuseOptions]
  );

  const hits = useMemo(() => {
    if (!query && matchAllOnEmptyQuery) {
      return list
        .slice(0, limit !== undefined ? limit : Infinity)
        .map((item, refIndex) => ({
          item,
          refIndex,
        }));
    }
    return fuse.search(query, { limit: limit ?? Infinity });
  }, [fuse, limit, matchAllOnEmptyQuery, query, list]);

  const setQuery = useCallback(debounce(100, updateQuery), []);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value.trim()),
    [setQuery]
  );

  return {
    hits,
    onSearch,
    query,
    setQuery,
  };
};
