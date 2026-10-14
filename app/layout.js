import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

/**
 * ========================================================================
 * ARCHIVO DE DISEÑO RAÍZ (app/layout.js) - MOTION LAB
 * ========================================================================
 * Configuración de etiquetas globales, metadatos SEO y soporte de
 * visualización de alto contraste para celulares bajo sol directo.
 */

export const metadata = {
  title: 'MOTION LAB | High Performance Training & Planificación Personalizada',
  description: 'Laboratorio de movimiento y rendimiento atlético. Planes de entrenamiento con base científica: Plan Base y Plan Premium Personalizado 1 a 1.',
  keywords: ['MOTION LAB', 'entrenamiento de alto rendimiento', 'personal trainer', 'planificación de fuerza', 'biomecánica', 'hipertrofia'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#05070c' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('motion_lab_theme');
                  if (theme === 'sunlight') {
                    document.documentElement.classList.add('sunlight-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#05070c] text-slate-100 antialiased min-h-screen selection:bg-blue-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
