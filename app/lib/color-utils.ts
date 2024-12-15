import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function adjustColorForContrast(
  backgroundColor: string,
  textColor: string,
  targetRatio = 4.5
): string {
  const bgColor = colord(backgroundColor);
  let adjustedColor = colord(textColor);

  while (adjustedColor.contrast(bgColor) < targetRatio) {
    const rgb = hexToRgb(adjustedColor.toHex());
    if (bgColor.isDark()) {
      rgb.r = Math.min(255, rgb.r + 5);
      rgb.g = Math.min(255, rgb.g + 5);
      rgb.b = Math.min(255, rgb.b + 5);
    } else {
      rgb.r = Math.max(0, rgb.r - 5);
      rgb.g = Math.max(0, rgb.g - 5);
      rgb.b = Math.max(0, rgb.b - 5);
    }
    adjustedColor = colord(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  return adjustedColor.toHex();
}

export function generateAccessibleColorScheme(baseScheme: Record<string, string>): Record<string, string> {
  const accessibleScheme = { ...baseScheme };

  // Adjust text color for contrast with background
  accessibleScheme.text = adjustColorForContrast(baseScheme.background, baseScheme.text);

  // Adjust primary color for contrast with background
  accessibleScheme.primary = adjustColorForContrast(baseScheme.background, baseScheme.primary);

  // Adjust secondary color for contrast with background
  accessibleScheme.secondary = adjustColorForContrast(baseScheme.background, baseScheme.secondary);

  // Adjust accent color for contrast with background
  accessibleScheme.accent = adjustColorForContrast(baseScheme.background, baseScheme.accent);

  return accessibleScheme;
}

