import LoginForm from '@/modules/auth/components/LoginForm';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Panel izquierdo - Testimonial */}
            <div className="relative hidden w-full bg-gray-800 md:flex md:w-1/2 md:flex-col md:items-start md:justify-between p-8">
                <div className="flex items-center">
                    <div className="mr-2">
                        <Image src="/window.svg" alt="Logo" width={24} height={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Nitro.</h2>
                </div>

                <div className="my-auto max-w-md">
                    <blockquote className="text-xl font-medium text-white">
                        &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
                    </blockquote>
                    <div className="mt-6 text-base text-gray-400">
                        Sofia Davis
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 md:w-1/2 md:px-20 lg:px-32">
                <div className='w-full max-w-sm space-y-8'>
                    <LoginForm />


                    <p className="text-center text-sm text-gray-500 mt-8">
                        Al ingresar usted acepta nuestros{' '}
                        <Link href="#" className="underline underline-offset-2 hover:text-gray-900">
                            Terminos de Servicio
                        </Link>{' '}
                        y{' '}
                        <Link href="#" className="underline underline-offset-2 hover:text-gray-900">
                            Politicas de Privacidad
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}