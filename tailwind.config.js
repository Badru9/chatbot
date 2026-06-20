// import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // heroui({
    //   addCommonColors: true,
    //   defaultTheme: 'light',
    //   defaultExtendTheme: 'light',
    //   themes: {
    //     light: {
    //       colors: {
    //         primary: '#0f2854',
    //         secondary: '#E3E3E3',
    //         tertiary: '#234C6A',
    //       },
    //     },
    //     dark: {
    //       colors: {
    //         primary: '#0f2854',
    //         secondary: '#E3E3E3',
    //         tertiary: '#234C6A',
    //       },
    //     },
    //   },
    // }),
  ],
};
