import { useMemo, useState } from "react";
import { HelpCircle, Plus, Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { AdminButton } from "@/components/ui/AdminButton";
import { useAdmins, useDeleteAdmin, useToggleAdminStatus } from "../hooks/useAdmins";
import { AdminsTable } from "../components/AdminsTable";
import { HowRolesWorkModal } from "../components/HowRolesWorkModal";
import { CreateAdminDialog } from "../components/CreateAdminDialog";
import { DeleteAdminDialog } from "../components/DeleteAdminDialog";
import { ToggleAdminStatusDialog } from "../components/ToggleAdminStatusDialog";
import type { AdminUserAccount } from "../types/user";
import { TableSkeleton } from "../components/skeletons";

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 200);

  const [howRolesWorkOpen, setHowRolesWorkOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [viewingAdmin, setViewingAdmin] = useState<AdminUserAccount | null>(null);
  const [pendingStatusAdmin, setPendingStatusAdmin] = useState<AdminUserAccount | null>(null);
  const [pendingDeleteAdmin, setPendingDeleteAdmin] = useState<AdminUserAccount | null>(null);

  const { data: admins, isLoading, isError } = useAdmins();
  const toggleStatusMutation = useToggleAdminStatus();
  const deleteMutation = useDeleteAdmin();

  const filteredAdmins = useMemo(() => {
    if (!admins) return [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return admins;
    return admins.filter((admin) => {
      const name = admin.name?.toLowerCase() || "";
      const email = admin.email?.toLowerCase() || "";
      const role = admin.adminProfile?.adminRole?.toLowerCase() || "";
      return name.includes(query) || email.includes(query) || role.includes(query);
    });
  }, [admins, debouncedSearch]);

  const handleConfirmToggleStatus = (admin: AdminUserAccount) => {
    toggleStatusMutation.mutate(
      { userId: admin.id, isActive: !admin.isActive },
      {
        onSuccess: () => setPendingStatusAdmin(null),
      }
    );
  };

  const handleConfirmDelete = (admin: AdminUserAccount) => {
    deleteMutation.mutate(admin.id, {
      onSuccess: () => setPendingDeleteAdmin(null),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Admin Management
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage administrative team members, access roles, and system permission privileges
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => setHowRolesWorkOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200"
          >
            <HelpCircle className="w-4 h-4 text-primary-600" />
            How roles work
          </AdminButton>

          <AdminButton
            size="sm"
            onClick={() => setCreateAdminOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </AdminButton>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search admin by name, email, or role..."
          className="h-10 w-full rounded-[8px] border border-neutral-200 bg-white pl-10 pr-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {isLoading && <TableSkeleton rows={5} columns={4} showHeader={false} />}

      {isError && (
        <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
          Failed to load administrator accounts. Please try refreshing the page.
        </div>
      )}

      {!isLoading && !isError && (
        <AdminsTable
          admins={filteredAdmins}
          onView={setViewingAdmin}
          onToggleStatus={setPendingStatusAdmin}
          onDelete={setPendingDeleteAdmin}
          isUpdatingStatus={toggleStatusMutation.isPending}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {/* Modals & Dialogs */}
      <HowRolesWorkModal
        open={howRolesWorkOpen}
        onOpenChange={setHowRolesWorkOpen}
      />

      <CreateAdminDialog
        open={createAdminOpen}
        onOpenChange={setCreateAdminOpen}
      />

      <ViewAdminDialog
        admin={viewingAdmin}
        open={viewingAdmin !== null}
        onOpenChange={(open) => !open && setViewingAdmin(null)}
        onToggleStatus={(adm) => {
          setViewingAdmin(null);
          setPendingStatusAdmin(adm);
        }}
      />

      <ToggleAdminStatusDialog
        admin={pendingStatusAdmin}
        open={pendingStatusAdmin !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatusAdmin(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        isPending={toggleStatusMutation.isPending}
      />

      <DeleteAdminDialog
        admin={pendingDeleteAdmin}
        open={pendingDeleteAdmin !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteAdmin(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default AdminManagement;
