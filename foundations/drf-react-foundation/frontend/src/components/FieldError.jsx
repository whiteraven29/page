/** Shows the first message for one field from an ApiError's details. */
export default function FieldError({ error, field }) {
  const msg = error?.details?.[field];
  if (!msg) return null;
  return <span className="field-error">{Array.isArray(msg) ? msg[0] : String(msg)}</span>;
}
