const ERROR_MESSAGES: Record<string, string> = {
  otp_expired:
    "This confirmation link has expired or was already used. Sign up again or sign in and request a new confirmation email.",
  access_denied:
    "Email confirmation was denied or the link is invalid. Please try signing up again.",
  auth_callback:
    "We could not complete sign-in from your email link. Try again or sign in with your password.",
  verify_failed:
    "Email verification failed. Request a new confirmation link.",
};

export function AuthErrorAlert({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (!error && !message) return null;

  const text =
    message ??
    ERROR_MESSAGES[error ?? ""] ??
    "Something went wrong during authentication. Please try again.";

  return (
    <div
      className="mb-4 w-full max-w-md rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      role="alert"
    >
      <p className="font-medium">Could not confirm your email</p>
      <p className="mt-1 opacity-90">{text}</p>
      {error === "otp_expired" && (
        <p className="mt-2 text-xs opacity-80">
          Tip: Open the link in the same browser where you signed up, and use the
          newest email (older links expire).
        </p>
      )}
    </div>
  );
}
