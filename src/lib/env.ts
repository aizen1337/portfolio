export function isDevelopmentAdminBypassEnabled() {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  return process.env.DEV_MOCK_GITHUB_LOGIN !== "false";
}

export function getDevelopmentAdminLogin() {
  return process.env.DEV_MOCK_GITHUB_LOGIN?.trim() || "dev-admin";
}

export function getDevelopmentAdminEmail() {
  return process.env.DEV_MOCK_GITHUB_EMAIL?.trim() || "dev-admin@local.test";
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isAuthConfigured() {
  if (isDevelopmentAdminBypassEnabled()) {
    return true;
  }

  return Boolean(
    process.env.GITHUB_ID &&
      process.env.GITHUB_SECRET &&
      process.env.NEXTAUTH_SECRET
  );
}

export function getAdminGitHubLogins() {
  return (process.env.ADMIN_GITHUB_LOGINS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getNotificationEmail() {
  return process.env.NOTIFICATION_EMAIL ?? process.env.CONTACT_EMAIL ?? "";
}
