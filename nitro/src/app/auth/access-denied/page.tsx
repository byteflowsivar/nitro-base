import AccessDenied from '@/modules/auth/components/AccessDenied';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso Denegado',
};

export default function AccessDeniedPage() {
  return <AccessDenied />;
}
