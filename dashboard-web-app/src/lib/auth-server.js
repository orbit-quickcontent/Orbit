 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { firestoreDb } from "./db";










/**
 * Get authenticated user session on the server.
 */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!_optionalChain([session, 'optionalAccess', _ => _.user])) return null;
  return session.user ;
}

/**
 * Require a specific role or list of roles.
 */
export async function requireRole(allowedRoles) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Access restricted to roles [${allowedRoles.join(", ")}]`);
  }
  return user;
}

/**
 * Create a secure system audit log.
 */
export async function logAudit(params






) {
  try {
    let ipAddress = null;
    let userAgent = null;

    if (params.req) {
      ipAddress = params.req.headers.get("x-forwarded-for") || params.req.headers.get("x-real-ip");
      userAgent = params.req.headers.get("user-agent");
    }

    let targetCollection = firestoreDb.clientAuditLogs;
    if (params.userId) {
      const userIsPartner = await firestoreDb.partnerUsers.findUnique({
        where: { id: params.userId },
      });
      if (userIsPartner) {
        targetCollection = firestoreDb.partnerAuditLogs;
      }
    }

    await targetCollection.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: params.details ? JSON.stringify(params.details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}
