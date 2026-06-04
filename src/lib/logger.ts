/**
 * Security Audit Logger
 * Logs security-relevant events for monitoring and incident response.
 * In production, this should write to a persistent store (e.g., MongoDB, cloud logging).
 */

export type SecurityEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGOUT"
  | "PASSWORD_CHANGE"
  | "UNAUTHORIZED_ACCESS"
  | "RATE_LIMIT_EXCEEDED"
  | "CSRF_FAILURE"
  | "FILE_UPLOAD"
  | "DATA_CREATE"
  | "DATA_UPDATE"
  | "DATA_DELETE"
  | "SUSPICIOUS_ACTIVITY";

export interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: "info" | "warning" | "error" | "critical";
  userId?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: Record<string, unknown>;
  error?: string;
}

/**
 * Log a security event.
 * In development, logs to console.
 * In production, should send to centralized logging (e.g., MongoDB, Datadog, Splunk).
 */
export async function logSecurityEvent(event: Omit<SecurityEvent, "timestamp">): Promise<void> {
  const fullEvent: SecurityEvent = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  // In development, log to console with clear formatting
  if (process.env.NODE_ENV === "development") {
    const emoji = {
      info: "ℹ️",
      warning: "⚠️",
      error: "❌",
      critical: "🚨",
    }[event.severity];

    console.log(
      `${emoji} [SECURITY] ${event.type} | ${event.severity.toUpperCase()} | ${fullEvent.timestamp}`
    );
    if (event.userId) console.log(`   User: ${event.username || event.userId}`);
    if (event.ip) console.log(`   IP: ${event.ip}`);
    if (event.path) console.log(`   Path: ${event.method} ${event.path}`);
    if (event.details) console.log(`   Details:`, event.details);
    if (event.error) console.log(`   Error: ${event.error}`);
    return;
  }

  // In production, you should:
  // 1. Write to a dedicated security log collection in MongoDB
  // 2. Send to a SIEM or logging service
  // 3. Alert on critical events

  // Example: Write to MongoDB (uncomment when ready)
  // try {
  //   const { default: SecurityLog } = await import("@/models/SecurityLog");
  //   await SecurityLog.create(fullEvent);
  // } catch (err) {
  //   console.error("Failed to write security log:", err);
  // }

  // For now, log to console in production too (until MongoDB collection is set up)
  console.log(`[SECURITY] ${JSON.stringify(fullEvent)}`);
}

/**
 * Helper to extract client info from a request for logging.
 */
export function getClientInfo(request: Request): {
  ip: string;
  userAgent: string;
} {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "unknown";

  const userAgent = request.headers.get("user-agent") || "unknown";

  return { ip, userAgent };
}

/**
 * Log authentication events.
 */
export async function logAuthEvent(
  type: "LOGIN_SUCCESS" | "LOGIN_FAILURE" | "LOGOUT" | "UNAUTHORIZED_ACCESS" | "PASSWORD_CHANGE",
  request: Request,
  options?: {
    userId?: string;
    username?: string;
    error?: string;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  const { ip, userAgent } = getClientInfo(request);

  await logSecurityEvent({
    type,
    severity: type === "LOGIN_SUCCESS" ? "info" : type === "LOGIN_FAILURE" ? "warning" : "error",
    ip,
    userAgent,
    path: new URL(request.url).pathname,
    method: request.method,
    userId: options?.userId,
    username: options?.username,
    error: options?.error,
    details: options?.details,
  });
}

/**
 * Log data modification events (create, update, delete).
 */
export async function logDataEvent(
  type: "DATA_CREATE" | "DATA_UPDATE" | "DATA_DELETE",
  request: Request,
  options: {
    userId: string;
    username: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  const { ip, userAgent } = getClientInfo(request);

  await logSecurityEvent({
    type,
    severity: "info",
    ip,
    userAgent,
    path: new URL(request.url).pathname,
    method: request.method,
    userId: options.userId,
    username: options.username,
    details: {
      resource: options.resource,
      resourceId: options.resourceId,
      ...options.details,
    },
  });
}
