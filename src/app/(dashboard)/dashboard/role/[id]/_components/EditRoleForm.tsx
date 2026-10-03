/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PulseLoader } from "react-spinners";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import { RoleFeatures } from "@/constant/roleFeatures/index";
import { createRoleSchema, type CreateRoleFormValues } from "@/validations/role.validation";
import type { TAdminUser } from "@/types/auth.types";
import GroupAvatar from "../../_components/GroupAvatar";
import Link from "next/link";

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

    // Merge role features with all available features to show checked status.
    // Matches Create Role logic, but pre-fills from the fetched role.
    // Match by name so legacy/seeded path variants still resolve correctly.
    const roleFeatures = roleData?.roleFeature ?? [];
    const initialFeatures = RoleFeatures.map((feature) => ({
        ...feature,
        isChecked: roleFeatures.some(
            (roleFeature: any) => roleFeature.name === feature.name
        ),
    }));

    const [features, setFeatures] = useState(initialFeatures);
    const selectedFeaturesCount = features.filter(
        (feature) => feature.isChecked
    ).length;

    // Same validation rules as Create Role.
    const form = useForm<CreateRoleFormValues>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            roleName: roleData?.name ?? "",
            features: initialFeatures,
        },
    });

    const assignedAdmins: TAdminUser[] = roleData?.adminUser ?? [];

    const handleFeatureCheck = (index: number) => {
        const feature = features[index];
        // Don't allow removing the core permission from Super Admin in the UI;
        // the backend also rejects it with a 403 as a second layer.
        if (isSuperAdmin && feature.name === "Roles" && feature.isChecked) {
            showErrorToast("Super Admin must keep the Roles permission");
            return;
        }
        const updatedFeatures = [...features];
        updatedFeatures[index].isChecked = !updatedFeatures[index].isChecked;
        setFeatures(updatedFeatures);
        form.setValue("features", updatedFeatures);
    };

    const onSubmit = async (data: CreateRoleFormValues) => {
        const selectedFeatures = data.features
            .filter((feature: any) => feature.isChecked)
            .map((feature: any) => ({
                name: feature.name,
                index: feature.index,
                path: feature.path,
            }));

        const payload = {
            name: data.roleName,
            roleFeature: selectedFeatures,
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
                                                    The Super Admin role cannot be renamed.
                                                </p>
                                            ) : (
                                                <FormMessage />
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Feature Permissions</h2>
                                    <Badge
                                        variant="outline"
                                        className="bg-primary/5 px-3 py-1 text-primary"
                                    >
                                        {selectedFeaturesCount} selected
                                    </Badge>
                                </div>

                                <div className="rounded-lg border border-slate-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y">
                                        {features.map((feature: any, featureIndex: number) => (
                                            <div
                                                key={feature.index}
                                                className={`transition-colors ${feature.isChecked
                                                        ? "bg-primary/5"
                                                        : "hover:bg-slate-50"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between p-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`features.${featureIndex}.isChecked`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex w-full items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={() =>
                                                                            handleFeatureCheck(featureIndex)
                                                                        }
                                                                        className="cursor-pointer"
                                                                    />
                                                                </FormControl>
                                                                <div className="flex-1">
                                                                    <FormLabel className="text-base font-medium">
                                                                        {feature.name}
                                                                    </FormLabel>
                                                                    {feature.path && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {feature.path}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {feature.isChecked && (
                                                                    <Check className="h-5 w-5 text-primary" />
                                                                )}
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Assigned Admins</h2>
                                    <Badge
                                        variant="outline"
                                        className="bg-primary/5 px-3 py-1 text-primary"
                                    >
                                        {assignedAdmins.length} assigned
                                    </Badge>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    {assignedAdmins.length > 0 ? (
                                        <div className="flex flex-col gap-4">
                                            <GroupAvatar users={assignedAdmins} />
                                            <ul className="divide-y divide-slate-100">
                                                {assignedAdmins.map((admin) => (
                                                    <li
                                                        key={admin.id}
                                                        className="flex items-center justify-between py-2 text-sm"
                                                    >
                                                        <span className="font-medium">
                                                            {admin.fullName}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {admin.email}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-sm text-muted-foreground">
                                                To move an admin to another role, use the admin
                                                management flow (update admin role). Admins are
                                                shown here read-only.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No admins are assigned to this role yet.
                                        </p>
                                    )}
                                </div>
                            </div>

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
