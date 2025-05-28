// vite.config.js
import { defineConfig } from "file:///D:/INTERN/Projects/THUC_TAP/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/INTERN/Projects/THUC_TAP/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import svgr from "file:///D:/INTERN/Projects/THUC_TAP/frontend/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "D:\\INTERN\\Projects\\THUC_TAP\\frontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  // esbuild: {
  //     loader: 'jsx',
  //     include: /src\/.*\.jsx?$/,
  //     exclude: [],
  // },
  // optimizeDeps: {
  //     esbuildOptions: {
  //         plugins: [
  //             {
  //                 name: 'load-js-files-as-jsx',
  //                 setup(build) {
  //                     build.onLoad(
  //                         { filter: /src\\.*\.js$/ },
  //                         async (args) => ({
  //                             loader: 'jsx',
  //                             contents: await fs.readFile(args.path, 'utf8'),
  //                         })
  //                     );
  //                 },
  //             },
  //         ],
  //     },
  // },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  plugins: [svgr(), react()],
  base: "/Manage-System"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJTlRFUk5cXFxcUHJvamVjdHNcXFxcVEhVQ19UQVBcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXElOVEVSTlxcXFxQcm9qZWN0c1xcXFxUSFVDX1RBUFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovSU5URVJOL1Byb2plY3RzL1RIVUNfVEFQL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuLy8gaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgc3JjOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgLy8gZXNidWlsZDoge1xyXG4gICAgLy8gICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICAvLyAgICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuanN4PyQvLFxyXG4gICAgLy8gICAgIGV4Y2x1ZGU6IFtdLFxyXG4gICAgLy8gfSxcclxuICAgIC8vIG9wdGltaXplRGVwczoge1xyXG4gICAgLy8gICAgIGVzYnVpbGRPcHRpb25zOiB7XHJcbiAgICAvLyAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgIC8vICAgICAgICAgICAgIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHNldHVwKGJ1aWxkKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGJ1aWxkLm9uTG9hZChcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHsgZmlsdGVyOiAvc3JjXFxcXC4qXFwuanMkLyB9LFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKGFyZ3MpID0+ICh7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgXSxcclxuICAgIC8vICAgICB9LFxyXG4gICAgLy8gfSxcclxuXHJcblxyXG5cclxuICAgIC8vIHBsdWdpbnM6IFtyZWFjdCgpLHN2Z3Ioe1xyXG4gICAgLy8gICBleHBvcnRBc0RlZmF1bHQ6IHRydWVcclxuICAgIC8vIH0pXSxcclxuXHJcbiAgICBwbHVnaW5zOiBbc3ZncigpLCByZWFjdCgpXSxcclxuICAgIGJhc2U6ICcvTWFuYWdlLVN5c3RlbSdcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1MsU0FBUyxvQkFBb0I7QUFDclUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNqQztBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUErQkEsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN6QixNQUFNO0FBQ1YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
