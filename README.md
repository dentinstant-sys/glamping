# royal-web

Frontend público de Royal Glamping. **Vite + React + TypeScript +
Tailwind v4 + Firebase.**

## Requisitos

- Node 20+
- Firebase project `estelar-prod` (llaves en `.env`)

## Setup

```bash
npm install
cp .env.example .env   # rellenar con las llaves de estelar-prod
npm run dev            # http://localhost:5173
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | ESLint |

## Estructura

```
src/
├── main.tsx          Entry
├── App.tsx           Shell de rutas (react-router)
├── index.css         Tailwind v4 + tokens Royal (tema claro)
├── lib/
│   └── firebase.ts   Init Firebase (Firestore + Functions) desde env
├── pages/            Páginas por ruta (Home placeholder)
├── components/       Componentes reutilizables
└── assets/           Estáticos
```

## Notas

- **Tokens visuales:** definidos en `src/index.css`
  (tema claro). No hardcodear colores: usar utilidades `bg-fondo`,
  `text-oro-texto`, `font-display`, etc.
- **Tipos de datos:** el modelo Firestore se consume desde el paquete
  compartido (`shared/types/firestore.ts` en la raíz).
- **Backend:** reglas/índices/Functions viven en la raíz del proyecto, no aquí.
