import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgba(125, 220, 255, 0.34) transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
    margin: 6px;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(125, 220, 255, 0.34);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
    min-height: 36px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(125, 220, 255, 0.48);
    background-clip: content-box;
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  button {
    border: none;
  }

  input,
  textarea,
  button {
    outline: none;
  }
`;