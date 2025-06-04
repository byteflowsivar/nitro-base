import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangePasswordForm } from '../change-password-form';

// Mock para el useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('ChangePasswordForm', () => {
  it('muestra errores de validación cuando los campos están vacíos', async () => {
    render(<ChangePasswordForm />);

    const submitButton = screen.getByRole('button', { name: /actualizar contraseña/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la contraseña actual es requerida/i)).toBeInTheDocument();
    });
  });

  it('muestra error cuando las contraseñas no coinciden', async () => {
    render(<ChangePasswordForm />);

    await userEvent.type(
      screen.getByPlaceholderText(/ingresa tu contraseña actual/i),
      'Password123!'
    );
    await userEvent.type(screen.getByPlaceholderText(/crea una contraseña segura/i), 'NewPass123!');
    await userEvent.type(
      screen.getByPlaceholderText(/confirma tu nueva contraseña/i),
      'DifferentPass123!'
    );

    const submitButton = screen.getByRole('button', { name: /actualizar contraseña/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('valida requisitos de contraseña fuerte', async () => {
    render(<ChangePasswordForm />);

    const newPasswordInput = screen.getByPlaceholderText(/crea una contraseña segura/i);

    // Contraseña muy corta
    await userEvent.type(newPasswordInput, 'Abc1!');

    await waitFor(() => {
      expect(screen.getByText(/debe tener al menos 7 caracteres/i)).toBeInTheDocument();
    });

    // Limpiar y poner contraseña sin mayúsculas
    await userEvent.clear(newPasswordInput);
    await userEvent.type(newPasswordInput, 'abcdefg!');

    const submitButton = screen.getByRole('button', { name: /actualizar contraseña/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/debe contener al menos una letra mayúscula/i)).toBeInTheDocument();
    });
  });
});
