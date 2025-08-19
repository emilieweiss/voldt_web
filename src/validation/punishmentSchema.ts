import { z } from 'zod';

export const punishmentSchema = z.object({
    selectedUserId: z.string().min(1, 'Vælg en bruger'),
    penaltyAmount: z
        .number({ invalid_type_error: 'Skal være et tal' })
        .min(1, 'Beløbet skal være mindst 1 kr.')
        .max(10000, 'Beløbet kan ikke være over 10.000 kr.')
        .int('Skal være et helt tal'),
    penaltyReason: z
        .string()
        .min(3, 'Årsagen skal være mindst 3 tegn')
        .max(200, 'Årsagen kan maksimalt være 200 tegn'),
});

export type PunishmentFormData = z.infer<typeof punishmentSchema>;