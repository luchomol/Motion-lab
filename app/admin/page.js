/**
 * ========================================================================
 * PÁGINA: Dashboard del Entrenador Matías (app/admin/page.js)
 * ========================================================================
 * Acceso al panel administrativo para validar pagos de alumnos y
 * asignar rutinas en los 3 bloques metodológicos de Motion Lab.
 * Incluye toggle de Modo Soleado / Noche en la cabecera.
 */

import DashboardTrainer from '@/components/admin/DashboardTrainer';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Panel del Entrenador • Matías | MOTION LAB',
  description: 'Gestión de alumnos, validación de pagos y asignación de rutinas en 3 bloques.',
};

export default function AdminPage() {
  return (
    <AdminShell>
      <DashboardTrainer />
    </AdminShell>
  );
}
