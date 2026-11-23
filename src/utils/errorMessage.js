/**
 * Readable message from anything a catch block receives: an AppSync/GraphQL
 * error ({ errors: [{ message }] }), an Error, or a string. Never throws.
 */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const first = Array.isArray(error.errors) && error.errors[0];
  return (first && first.message) || error.message || fallback;
}
