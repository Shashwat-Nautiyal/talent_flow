// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder required by React Router v7
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill for TransformStream required by MSW
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    readable: any;
    writable: any;
    constructor() {
      this.readable = {};
      this.writable = {};
    }
  };
}
