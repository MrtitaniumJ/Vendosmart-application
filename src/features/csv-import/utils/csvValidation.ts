import { REQUIRED_HEADERS } from "../../../types/bom";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates CSV headers against required headers
 */
export function validateHeaders(headers: string[]): ValidationResult {
  const errors: string[] = [];
  const normalizedHeaders = headers.map((h) => h.trim());
  const normalizedRequired = REQUIRED_HEADERS.map((h) => h.trim());

  // Check for missing headers
  const missingHeaders = normalizedRequired.filter(
    (required) => !normalizedHeaders.includes(required)
  );

  if (missingHeaders.length > 0) {
    errors.push(
      `Missing required headers: ${missingHeaders.join(", ")}`
    );
  }

  // Check for extra headers (optional, but good to warn)
  const extraHeaders = normalizedHeaders.filter(
    (header) => !normalizedRequired.includes(header)
  );

  if (extraHeaders.length > 0 && missingHeaders.length === 0) {
    // Only warn about extra headers if we have all required ones
    // This is informational, not an error
  }

  return {
    isValid: missingHeaders.length === 0,
    errors,
  };
}
