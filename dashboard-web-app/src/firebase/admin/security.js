import { UserRole } from "./types";

export const securityService = {
  /**
   * Check if a given user role has access to specific routes/actions
   */
  hasRoleAccess: (currentRole, allowedRoles) => {
    return allowedRoles.includes(currentRole);
  },

  /**
   * Check if user permissions allow a specific operation
   */
  hasPermission: (userPermissions, requiredPermission) => {
    if (userPermissions.includes("*") || userPermissions.includes("admin:*")) {
      return true;
    }
    return userPermissions.includes(requiredPermission);
  }
};
;
