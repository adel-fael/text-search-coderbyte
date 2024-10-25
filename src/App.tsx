import './App.css';
import { MockQuotes } from './assets/MockQuotes';

import FuseHighlight from './FuseHighlight';
import { useFuse } from './useFuse';

function App() {
  const { hits, query, onSearch } = useFuse(MockQuotes.quotes, {
    keys: ['quote', 'author'],
    matchAllOnEmptyQuery: true,
    includeMatches: true,
    minMatchCharLength: 2,
  });

  return (
    <>
      <div className="container">
        <h1>Inspirational Quotes</h1>

        <div className="group">
          <svg
            className="icon"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            placeholder="Search (quote, author)"
            type="search"
            className="input"
            onChange={onSearch}
          />
        </div>
        {query.length > 0 && (
          <p style={{ textAlign: 'left' }}>
            Results for "<mark>{query}</mark>":
          </p>
        )}

        <div className="quotes-container">
          {hits && hits.length > 0 ? (
            hits?.map((hit) => (
              <div
                key={hit.item.id}
                className="quote"
              >
                <p>
                  <FuseHighlight
                    hit={hit}
                    attribute="quote"
                  />
                </p>
                <p className="author">
                  -{' '}
                  <FuseHighlight
                    hit={hit}
                    attribute="author"
                  />
                </p>
              </div>
            ))
          ) : (
            <div>No results</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
