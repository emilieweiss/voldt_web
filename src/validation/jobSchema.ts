import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Påkrævet'),
  address: z.string().min(1, 'Påkrævet'),
  description: z.string().min(1, 'Påkrævet').max(500, 'Maks 500 tegn'),
  duration: z
    .number({ invalid_type_error: 'Skal være et tal' })
    .min(0, 'Må ikke være negativ')
    .int('Skal være et helt tal'),
  delivery: z.string().min(1, 'Påkrævet'),
  money: z
    .number({ invalid_type_error: 'Skal være et tal' })
    .min(0, 'Må ikke være negativ'),
});
