import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { loading, session, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-body text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-6 text-center">
        <h1 className="font-display text-2xl">Not authorized</h1>
        <p className="font-body text-sm text-muted-foreground max-w-md">
          Your account doesn't have admin access. Contact the site owner.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
