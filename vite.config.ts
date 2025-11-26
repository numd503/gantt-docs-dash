import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Library build mode for MkDocs integration
  if (mode === 'library') {
    return {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/lib/ganttLibrary.ts'),
          name: 'GanttLibrary',
          formats: ['umd'],
          fileName: () => 'gantt-library.js',
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {},
            assetFileNames: 'gantt-library.css',
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  // Default app mode
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
