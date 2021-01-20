import styled from 'styled-components';

export const ListContainer = styled.div`
  min-width: 350px;
  margin-top: 1rem;
  padding: 1rem 1rem;
  background-color: #ebecf0;
  border-radius: 3%;

  & h2 {
    font-weight: bold;
    margin-bottom: .5rem;
  }

  @media ${props => props.theme.tablet} {
    margin-left: 1.6rem; 
    margin-top: 0;
  }

  @media ${props => props.theme.desktop} {
    width: 15%;
  }
`;