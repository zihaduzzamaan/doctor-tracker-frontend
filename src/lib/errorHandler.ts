export interface AppError {
  message: string;
  field?: string;
  status?: number;
}

export function formatErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') {
    return normalizeMessage(error);
  }

  if (error instanceof Error) {
    // Check for network connection failures
    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed') ||
      error.name === 'TypeError'
    ) {
      return 'Connection failed. Please check your internet and try again.';
    }

    return normalizeMessage(error.message);
  }

  return 'Something went wrong on our end. Please try again later.';
}

function normalizeMessage(raw: string): string {
  const lower = raw.toLowerCase();

  if (lower.includes('invalid email or password') || lower.includes('incorrect password')) {
    return 'Incorrect email or password. Please try again.';
  }

  if (lower.includes('user not found') || lower.includes('account not found')) {
    return "We couldn't find an account with these details.";
  }

  if (lower.includes('unauthorized') || lower.includes('session expired') || lower.includes('jwt expired')) {
    return 'Your session has expired. Please log in again.';
  }

  if (lower.includes('required') || lower.includes('missing')) {
    return 'Please complete all required fields.';
  }

  if (
    lower.includes('500') ||
    lower.includes('internal server') ||
    lower.includes('something went wrong') ||
    lower.includes('failed to load resource')
  ) {
    return 'Something went wrong on our end. Please try again later.';
  }

  if (lower.includes('network') || lower.includes('connect')) {
    return 'Connection failed. Please check your internet and try again.';
  }

  return raw;
}
