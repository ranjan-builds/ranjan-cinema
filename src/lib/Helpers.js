export function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function getContrastColor(hexColor) {
  if (!hexColor) return "#FFFFFF";

  // Remove '#' if present
  hexColor = hexColor.replace("#", "");

  // Handle 3-digit shorthand hex
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Convert to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black text for light backgrounds, white for dark
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

export function formatRuntime(mins) {
  if (!mins || isNaN(mins)) return "N/A";

  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatPopularity(popularity, maxValue = 300) {
  if (!popularity || isNaN(popularity)) return 0;

  // Clamp to 0–100 range
  const percentage = Math.min((popularity / maxValue) * 100, 100);

  return Math.round(percentage);
}

// Simple color adjustment functions
export function getLighterShade(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

// Add to your existing Helpers.js
export const getDarkerShade = (hex, percent) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Darken each component
  r = Math.floor((r * (100 - percent)) / 100);
  g = Math.floor((g * (100 - percent)) / 100);
  b = Math.floor((b * (100 - percent)) / 100);

  return rgbToHex(r, g, b);
};
