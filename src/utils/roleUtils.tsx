import { UserRole } from '../types/auth';

export const roleHierarchy: Record<UserRole, number> = {
  'superadmin': 3,
  'user': 2,
  'guest': 1
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function ProtectedRoute({ 
  userRole, 
  requiredRole, 
  children 
}: { 
  userRole: UserRole | null; 
  requiredRole: UserRole; 
  children: React.ReactNode; 
}) {
  if (!userRole || !hasPermission(userRole, requiredRole)) {
    return <div>You don&apos;t have permission to access this page.</div>;
  }
  return <>{children}</>;
}
