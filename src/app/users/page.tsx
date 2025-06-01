
import { AppLayout } from "@/components/layout/app-layout";
import { UsersTable } from "@/components/users/users-table";
import { mockUsers } from "./user-data";

export default function UserManagementPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">User Management</h1>
          <p className="text-muted-foreground font-body">
            View, create, and manage user accounts and their protocol configurations.
          </p>
        </div>
        <UsersTable initialUsers={mockUsers} />
      </div>
    </AppLayout>
  );
}
