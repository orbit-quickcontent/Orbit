

export const securityService = {
  hasRoleAccess: (currentRole, allowedRoles) => {
    return allowedRoles.includes(currentRole);
  },
  hasPermission: (userPermissions, requiredPermission) => {
    if (userPermissions.includes("*") || userPermissions.includes("editor:*")) {
      return true;
    }
    return userPermissions.includes(requiredPermission);
  }
};
