import { z } from "zod";

import { passwordForSchema } from "@/shared/constants";

export const changePasswordSchema = z.object({
    currentPassword: passwordForSchema,
    newPassword: passwordForSchema
})