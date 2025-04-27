"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogOverlay,
    AlertDialogPortal
} from "@/components/ui/alert-dialog"

export default function SignOutPage() {
    const [open, setOpen] = React.useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    // Función para manejar la cancelación del cierre de sesión
    const handleCancel = () => {
        setOpen(false)
        // Redirigir al usuario a la página anterior o a la URL de callback
        router.push(callbackUrl)
    }

    // Función para manejar la confirmación del cierre de sesión
    const handleConfirm = async () => {
        setOpen(false)
        await signOut({ callbackUrl: "/auth/login" })
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <AlertDialog open={open} onOpenChange={setOpen} >
                <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Desea cerrar sesión?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción cerrará su sesión actual. Necesitará volver a iniciar sesión para acceder nuevamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm} className="rounded-md bg-gray-800 py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Cerrar Sesión</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
        </div>
    )
}