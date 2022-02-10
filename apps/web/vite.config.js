import { defineConfig } from "vite";
const path = require("path");
import vitePluginImp from 'vite-plugin-imp';
import tsconfigPaths from 'vite-tsconfig-paths';
import optimizationPersist from 'vite-plugin-optimize-persist';
import pkgConfig from 'vite-plugin-package-config';
import { visualizer } from 'rollup-plugin-visualizer';
import { getThemeVariables } from 'antd/dist/theme';

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths({ projects: ['tsconfig.app.json'] }),
      pkgConfig(),
      optimizationPersist(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
      visualizer(),
    ],
    build: {
      target: 'esnext',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: "build",
      rollupOptions: {
        output: {
          manualChunks: {
            'react-venders': ['react', 'react-dom', '@vitjs/runtime'],
          },
        },
      },
    },
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        { find: /^~/, replacement: '' },
      ]
    },
    server: {
      port: 4200,
      open: true
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        less: {
          // modifyVars: { 'primary-color': '#13c2c2' },
          modifyVars: getThemeVariables({
            dark: true,
            compact: true,
          }),
          javascriptEnabled: true,
        },
      },
    },
  }
}); 