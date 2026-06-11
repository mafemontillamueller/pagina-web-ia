Integración del componente Shader (React + Three.js)

Archivos añadidos:
- `src/components/ShaderPlane.tsx` — contiene `ShaderPlane` y `EnergyRing`.

Requisitos y pasos mínimos para usar:
1. Tener un proyecto React/Next.js (Next 13+ si desea `use client`).
2. Instalar dependencias:

```bash
npm install three @react-three/fiber
# o
yarn add three @react-three/fiber
```

3. Ejemplo de uso dentro de tu app (p. ej. `app/page.tsx` o `src/App.tsx`):

```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { ShaderPlane, EnergyRing } from './src/components/ShaderPlane'

export default function Page() {
  return (
    <div style={{ width: '100%', height: 420 }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight />
        <ShaderPlane position={[0, 0, 0]} color1="#6b3bff" color2="#00d4ff" />
        <EnergyRing radius={1.3} position={[0, 0, 0]} />
      </Canvas>
    </div>
  )
}
```

4. Alternativa: si tu sitio es estático, crea una pequeña app React/Next y coloca el Canvas en la sección donde añadimos el punto de montaje en `index.html`.

Notas:
- `ShaderPlane` usa `shaderMaterial` y `planeGeometry` con parámetros listos para ajustar.
- Ajusta `color1`/`color2`, la resolución de la geometría y la intensidad según necesites.

Si quieres, puedo también añadir un ejemplo mínimo de `package.json` y scripts para arrancar un entorno local con Vite o Next.js. Solo dime cuál prefieres.