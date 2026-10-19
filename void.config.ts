import { defineConfig } from 'void/config';

export default defineConfig({
  head: {
    titleTemplate: '%s｜食在輔大',
    htmlAttrs: { lang: 'zh-Hant-TW' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
});
