
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/train-a-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/train-a-app"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23572, hash: '76dfd64ab1144c7f91a0afb3e34cc4cfc801c4f64f912944ea6325bae43f4ecc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17146, hash: '320721d6a9babd67d2493d31f81e8cdf58df0065bd55e30b431b2c33c0894a48', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 23911, hash: 'fb782017835ccc3f1b93f9c4b2e07b2e78e88881b2a4bdfb424fa7e2e4afaa7d', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
