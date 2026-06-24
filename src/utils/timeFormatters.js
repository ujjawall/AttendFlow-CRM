/**
 * Convert 24-hour time format to 12-hour AM/PM format
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour AM/PM format (hh:MM AM/PM)
 */
export const formatTo12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  
  return `${String(h).padStart(2, '0')}:${minutes} ${period}`;
};
