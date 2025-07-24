import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

export interface ServerAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Get Firebase ID token from request headers
 * @param request Request object
 * @returns string | null
 */
export const getIdTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Also check for token in cookie (for SSR scenarios)
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const tokenCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("firebase-token="));
    if (tokenCookie) {
      return tokenCookie.split("=")[1];
    }
  }

  return null;
};

/**
 * Verify Firebase ID token (placeholder - requires Firebase Admin SDK)
 * Note: In a real application, you would use Firebase Admin SDK to verify the token
 * @param idToken Firebase ID token
 * @returns Promise<ServerAuthUser | null>
 */
export const verifyIdToken = async (
  idToken: string
): Promise<ServerAuthUser | null> => {
  try {
    // This is a placeholder implementation
    // In a real app, you would use Firebase Admin SDK:
    //
    // import { getAuth } from 'firebase-admin/auth';
    // const decodedToken = await getAuth().verifyIdToken(idToken);
    // return {
    //   uid: decodedToken.uid,
    //   email: decodedToken.email || null,
    //   displayName: decodedToken.name || null,
    //   photoURL: decodedToken.picture || null,
    // };

    console.warn(
      "verifyIdToken: Firebase Admin SDK not implemented. This is a placeholder."
    );
    return null;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
};

/**
 * Get authenticated user from request
 * @param request Request object
 * @returns Promise<ServerAuthUser | null>
 */
export const getAuthenticatedUser = async (
  request: Request
): Promise<ServerAuthUser | null> => {
  const idToken = getIdTokenFromRequest(request);
  if (!idToken) {
    return null;
  }

  return await verifyIdToken(idToken);
};

/**
 * Require authentication for a route
 * @param request Request object
 * @param redirectTo Redirect path if not authenticated
 * @returns Promise<ServerAuthUser>
 */
export const requireAuth = async (
  request: Request,
  redirectTo: string = "/login"
): Promise<ServerAuthUser> => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw redirect(redirectTo);
  }
  return user;
};

/**
 * Check if user is authenticated (boolean check)
 * @param request Request object
 * @returns Promise<boolean>
 */
export const isAuthenticatedServer = async (
  request: Request
): Promise<boolean> => {
  const user = await getAuthenticatedUser(request);
  return user !== null;
};

/**
 * Utility for loaders that require authentication
 * @param args LoaderFunctionArgs
 * @param redirectTo Redirect path if not authenticated
 * @returns Promise<ServerAuthUser>
 */
export const requireAuthLoader = async (
  args: LoaderFunctionArgs,
  redirectTo: string = "/login"
): Promise<ServerAuthUser> => {
  return await requireAuth(args.request, redirectTo);
};

/**
 * Utility for actions that require authentication
 * @param args ActionFunctionArgs
 * @param redirectTo Redirect path if not authenticated
 * @returns Promise<ServerAuthUser>
 */
export const requireAuthAction = async (
  args: ActionFunctionArgs,
  redirectTo: string = "/login"
): Promise<ServerAuthUser> => {
  return await requireAuth(args.request, redirectTo);
};

/**
 * Create a session cookie with the Firebase ID token
 * @param idToken Firebase ID token
 * @returns string
 */
export const createAuthCookie = (idToken: string): string => {
  return `firebase-token=${idToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`;
};

/**
 * Clear the authentication cookie
 * @returns string
 */
export const clearAuthCookie = (): string => {
  return `firebase-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
};
