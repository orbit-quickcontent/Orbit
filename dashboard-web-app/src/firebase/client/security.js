

export const securityService = {
  hasRoleAccess: (currentRole, allowedRoles) => {
    return allowedRoles.includes(currentRole);
  },
  hasPermission: (userPermissions, requiredPermission) => {
    if (userPermissions.includes("*") || userPermissions.includes("client:*")) {
      return true;
    }
    return userPermissions.includes(requiredPermission);
  }
};
