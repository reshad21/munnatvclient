/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateRole } from "@/services/role";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PulseLoader } from "react-spinners";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import RolePermissionMatrix from "../../_components/RolePermissionMatrix";
import {
    canonicalFeatureKey,
    countSelectedPermissions,
    FEATURE_KEYS,
    SUPPORTED_ACTIONS,
    type PermissionsMap,
} from "@/constant/permissions";
import { rolePermissionSchema, type RolePermissionFormValues } from "@/validations/role.validation";
import Link from "next/link";

/** Prefill the matrix from granular rows, falling back to legacy features. */
const buildInitialPermissions = (roleData: any): PermissionsMap => {
    const map: PermissionsMap = {};
    const rows = roleData?.rolePermission ?? [];
    if (rows.length > 0) {
        for (const row of rows) {
            const feature = canonicalFeatureKey(row.feature);
            if (!FEATURE_KEYS.includes(feature)) continue;
            const supported = SUPPORTED_ACTIONS[feature] ?? [];
            if (!(supported as string[]).includes(row.action)) continue;
            if (!map[feature]) map[feature] = [];
            if (!map[feature].includes(row.action)) map[feature].push(row.action);
        }
        return map;
    }
    for (const f of roleData?.roleFeature ?? []) {
        const feature = canonicalFeatureKey(f.path ?? f.name ?? "");
        if (!FEATURE_KEYS.includes(feature)) continue;
        map[feature] = [...(SUPPORTED_ACTIONS[feature] ?? [])];
    }
    return map;
};

export default function EditRoleForm({
    roleData,
    id,
}: {
    roleData: any;
    id: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isSuperAdmin =
        (roleData?.name ?? "").toLowerCase() === "super admin";

    const [permissions, setPermissions] = useState<PermissionsMap>(() =>
        buildInitialPermissions(roleData)
    );

    const form = useForm<RolePermissionFormValues>({
        resolver: zodResolver(rolePermissionSchema),
        defaultValues: {
            roleName: roleData?.name ?? "",
        },
    });

    const onSubmit = async (data: RolePermissionFormValues) => {
        if (!isSuperAdmin && countSelectedPermissions(permissions) === 0) {
            showErrorToast("Select at least one permission");
            return;
        }

        const payload = {
            name: data.roleName,
            permissions: Object.entries(permissions).flatMap(([feature, actions]) =>
                actions.map((action) => ({ feature, action }))
            ),
        };

        startTransition(async () => {
            const result = await updateRole(id, payload);
            if (result?.statusCode === 200) {
                showSuccessToast(result.message || "Role updated successfully");
                router.push("/dashboard/role");
                router.refresh();
            } else {
                showErrorToast(result?.message || "Failed to update role");
            }
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <DashboardWrapper>
                <Link href="/dashboard/role">
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Roles &amp; Permissions
                        </Button>
                    </div>
                </Link>

                <div className="mx-auto w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                            <div className="rounded-lg bg-brand/20 p-8">
                                <FormField
                                    control={form.control}
                                    name="roleName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">
                                                Role Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter role name"
                                                    className="max-w-md bg-white"
                                                    disabled={isSuperAdmin}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {isSuperAdmin ? (
                                                <p className="text-sm text-muted-foreground">
                                                    The Super Admin role cannot be renamed and
                                                    always keeps all permissions (read-only).
                                                </p>
                                            ) : (
                                                <FormMessage />
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <RolePermissionMatrix
                                value={permissions}
                                onChange={setPermissions}
                                readOnly={isSuperAdmin}
                            />

                            <Separator className="my-8" />

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/role")}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                    className="bg-brand hover:bg-brand/80 transition duration-200 cursor-pointer"
                                >
                                    {isPending ? <PulseLoader color="#ffffff" /> : "Update Role"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DashboardWrapper>
        </div>
    );
}
