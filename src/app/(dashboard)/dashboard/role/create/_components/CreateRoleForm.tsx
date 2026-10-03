"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
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
import { createRole } from "@/services/role";
import {
  countSelectedPermissions,
  type PermissionsMap,
} from "@/constant/permissions";
import {
  type RolePermissionFormValues,
  rolePermissionSchema,
} from "@/validations/role.validation";
import { PulseLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import RolePermissionMatrix from "../../_components/RolePermissionMatrix";

const CreateRoleForm = () => {
  const router = useRouter();
  const [permissions, setPermissions] = useState<PermissionsMap>({});
  const [isPending, startTransition] = useTransition();
  const form = useForm<RolePermissionFormValues>({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      roleName: "",
    },
  });

  const onSubmit = async (data: RolePermissionFormValues) => {
    if (countSelectedPermissions(permissions) === 0) {
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
      const result = await createRole(payload);

      if (result?.statusCode === 201) {
        showSuccessToast(result.message || "Role created successfully");
        router.push("/dashboard/role");
        router.refresh();
      } else {
        showErrorToast(result?.message || "Failed to create role");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardWrapper>
        <Link href={"/dashboard/role"}>
          <div className="mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roles
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <RolePermissionMatrix
                value={permissions}
                onChange={setPermissions}
              />

              <Separator className="my-8" />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    form.reset({ roleName: "" });
                    setPermissions({});
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-brand hover:bg-brand/80 transition duration-200 cursor-pointer"
                >
                  {isPending ? <PulseLoader color="#ffffff" /> : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DashboardWrapper>
    </div>
  );
};

export default CreateRoleForm;
