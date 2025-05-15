import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background-color: #f5f5f5; /* Matte, neutral background */
    color: #333333; /* Standard, accessible text color */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: #333333;
    transition: color 0.2s;

    &:hover {
      color: #0077ff;
    }
  }

  button {
    cursor: pointer;
    background-color: #0077ff;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: #005bb5;
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }

  input, textarea {
    font-family: inherit;
    padding: 0.5rem;
    border: 1px solid #cccccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #0077ff;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    color: #222222;
    font-weight: 500;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
    display: block;
  }
`;

export default GlobalStyles;
