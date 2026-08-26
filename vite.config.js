import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite';
=======
>>>>>>> b0b857c (Initial commit)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
<<<<<<< HEAD
    tailwindcss(),
=======
>>>>>>> b0b857c (Initial commit)
    babel({ presets: [reactCompilerPreset()] })
  ],
})
