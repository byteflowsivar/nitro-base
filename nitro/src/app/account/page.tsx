import { Metadata } from 'next';
import { Account } from '@/modules/account';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestiona tu información personal y seguridad',
};

export default function AccountPage() {
  return <Account />;
}
