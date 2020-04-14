import React from 'react';
import styled from 'styled-components'

const StyledInput = styled.input``;

function SearchInput(props) {
  return (
    <StyledInput {...props} />
  )
}

export default SearchInput;
