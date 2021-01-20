import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 2rem;
  min-width: 350px;
  max-width: 1200px;
  
  @media ${props => props.theme.tablet} {
    width: 55%;
    margin-top: 0;
  }
  
  @media ${props => props.theme.desktop} {
    width: 85%;
    height: 60%;
    /* margin-right: 1rem; */
    display: flex;
  }
`;

export const Scheduler = styled.div`
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  height: 100%;
  user-select: none;
  border-radius: 3%;
  background-color: white;
  padding: 0 10px;

  @media ${props => props.theme.desktop} {
    width: 60%;
    margin: 0;
  }

  & .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 8px;
    button {
      cursor: pointer;
      outline: none;
      display: inline-flex;
      background: transparent;
      border: none;
      font-size: 20pt;
      padding: 4px;
      border-radius: 4px;
      &:hover {
        background-color: rgba(gray, 0.1);
      }
      &:active {
        background-color: rgba(gray, 0.2);
      }
    }
    span.title {
      cursor: pointer;
      border-radius: 5px;
      padding: 4px 12px;
      &:hover {
        background-color: rgba(gray, 0.1);
      }
      &:active {
        background-color: rgba(gray, 0.2);
      }
    }
  }

  & .body {
    .row {
      display: flex;
      cursor: pointer;
      &:first-child {
        cursor: initial;
        .box {
          font-weight: bold;
        }
        .box:hover > span.text {
          background-color: white;
        }
      }
      .box {
        position: relative;
        display: inline-flex;
        width: calc(100% / 7);
        height: 0;
        padding-bottom: calc(100% / 7);
        font-size: 12pt;
        &:first-child {
          color: red;
        }
        &:last-child {
          color: #588dff;
        }
        &.grayed {
          color: gray;
        }
        &:hover {
          span.text {
            background-color: rgba(#588dff, 0.1);
          }
        }
        &.selected {
          span.text {
            background-color: #588dff;
            color: white;
          }
        }
        span.text {
          border-radius: 100%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 60%;
          height: 60%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        span.text.underline:after {
          content: '';
          display: block;
          width: 60%;
          height: 5px;
          bottom: 14%;
          background: #03fc7f;
          position: absolute;
          border-radius: 3px;
        }
      }
    }
  }
`;
