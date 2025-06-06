import { z } from 'zod';

export const SECRET_CODE = import.meta.env.VITE_SECRET_CODE;

export const signUpSchema = z.object({
    name: z.string().min(1, 'Navn skal udfyldes'),
    email: z.string().email('Ugyldig email'),
    password: z.string().min(6, 'Kodeord skal være mindst 6 tegn'),
    secret: z.string().refine((val) => val === SECRET_CODE, {
        message: 'Forkert hemmelig kode',
    }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;