import React from 'react';
import Downshift from 'downshift';
import styled from 'styled-components';
import SearchInput from './components/SearchInput';


const Div = styled.div`
  
`;

function Search({ barangays, getBrgyBoundary, loading }) {
  console.log({ loading })
  return (<div className="search-form">
    <Downshift
      onChange={getBrgyBoundary}
      itemToString={item => (item ? item.name : '')}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
        getMenuProps,
      }) => (
        <div>
          <div className="field">
            <div className={`control ${loading ? 'is-loading' : ''} is-large`}>
              <SearchInput disabled={loading} className="input is-large is-primary" {...getInputProps()} type="text" placeholder="Search Barangay" />
            </div>
            {barangays && barangays.length > 0 && (
            <ul {...getMenuProps()}>
              {isOpen && barangays.filter(brgy => brgy.name.toLowerCase().includes(inputValue.toLowerCase())).map((brgy, index) => (
                <li
                  key={brgy.name}
                  {...getItemProps({
                    key: brgy.name,
                    item: brgy,
                  index,
                  style: {
                    backgroundColor: highlightedIndex === index ? '#ddd' : '#fff',
                  },
                  })}
                >{brgy.name}
                </li>
                ))}
            </ul>
            )}
          </div>
        </div>
                  )}
    </Downshift>
          </div>);
}

export default Search;
