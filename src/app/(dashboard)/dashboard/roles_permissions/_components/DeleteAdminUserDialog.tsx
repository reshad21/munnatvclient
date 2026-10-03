"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteAdminUser } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const DeleteAdminUserDialog = ({
  id,
  name,
  disabled,
  disabledReason,
}: {
  id?: string;
  name?: string;
  disabled?: boolean;
  disabledReason?: string;
}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteAdminUser(id);

            if (result?.statusCode === 200) {
                setIsOpen(false);
                showSuccessToast(result.message || "Admin user deleted");
                router.refresh();
            } else {
                setIsOpen(false);
                showErrorToast(result?.message || "Failed to delete admin user");
            }
        });
    };

    return (
        <TooltipProvider>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <DialogTrigger asChild disabled={disabled}>
                                <button
                                    type="button"
                                    aria-label={name ? `Delete ${name}` : "Delete admin user"}
                                    disabled={disabled}
                                    className={`w-8 h-8 flex items-center justify-center border border-red-600 rounded transition-colors ${
                                        disabled
                                            ? "text-red-300 border-red-200 cursor-not-allowed"
                                            : "text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                                    }`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </DialogTrigger>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{disabled ? disabledReason || "Delete" : "Delete"}</p>
                    </TooltipContent>
                </Tooltip>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete admin user?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete
                            {name ? ` ${name}` : " this admin user"} and remove their
                            data from our servers.
                        </DialogDescription>
                        <div className="flex justify-end space-x-2 mt-4">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            >
                                {isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
};

export default DeleteAdminUserDialog;
