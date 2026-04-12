/** Check if honeypot field was filled (bots fill hidden fields) */
export function isBot(formData: FormData | Record<string, string>, fieldName = 'website'): boolean {
  const value = formData instanceof FormData ? formData.get(fieldName) : formData[fieldName];
  return !!value && String(value).trim().length > 0;
}

/** CSS to hide honeypot field from humans */
export const honeypotStyle = 'position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;';
