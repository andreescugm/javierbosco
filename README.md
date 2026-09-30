# javierbosco.com

Landing de **Javier Bosco Properties** — intermediación inmobiliaria off-market (Madrid, España e internacional).

## Stack
React 19 + TypeScript + Vite · Framer Motion · Lenis · Tailwind v4 (solo base) · tipografías autoalojadas (@fontsource).

## Desarrollo
```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build     # genera docs/ (lo que sirve GitHub Pages)
npm run preview   # sirve docs/ en local
```

## Dónde está cada cosa
- `src/App.tsx` — secciones de la página.
- `src/i18n.ts` — todos los textos en 9 idiomas.
- `src/legal.tsx` — aviso legal, privacidad, cookies, datos del titular y emails.
- `public/img/` — imágenes optimizadas (WebP).

## Formulario
Envía por FormSubmit a `javierboscointerno@gmail.com`. La primera vez que se usa un email nuevo, FormSubmit manda un correo de activación a esa dirección: hay que pulsar el enlace para que empiecen a llegar las solicitudes.

## Despliegue
Push a `main` → la Action `.github/workflows/deploy.yml` compila y hace commit de `docs/` → GitHub Pages publica en https://javierbosco.com.
