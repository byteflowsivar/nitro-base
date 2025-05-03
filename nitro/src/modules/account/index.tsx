import { Profile } from './profile';
import { ChangePasswordForm } from './change-password-form';

export function Account() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Profile />
        </div>
        <div>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export { Profile } from './profile';
export { ChangePasswordForm } from './change-password-form';
