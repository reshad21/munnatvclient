import * as z from "zod";

export const createRoleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  features: z.array(
    z.object({
      name: z.string(),
      isChecked: z.boolean(),
      index: z.number(),
      path: z.string().optional(),
    })
  ),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const rolePermissionSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
});

export type RolePermissionFormValues = z.infer<typeof rolePermissionSchema>;

export type TRoleFeature = {
  name: string;
  isChecked: boolean;
  index: number;
};
