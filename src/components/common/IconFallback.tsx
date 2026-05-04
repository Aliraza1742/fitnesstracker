import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconProps } from '../../types';

// A small helper that renders an Ionicons glyph when available,
// otherwise falls back to a provided React element (usually a lucide icon).
interface Props {
  name: string;
  size?: number;
  color?: string;
  fallback?: React.ReactElement | null;
}

export const IconFallback: React.FC<Props> = ({ name, size = 20, color = '#000', fallback = null }) => {
  // Try to detect whether the glyph is available in the Ionicons glyph map.
  // The glyph map API may vary across versions; guard access safely.
  let supports = false;
  try {
    const glyphMap = (Ionicons as any).getRawGlyphMap ? (Ionicons as any).getRawGlyphMap() : (Ionicons as any).glyphMap;
    supports = !!(glyphMap && glyphMap[name]);
  } catch (e) {
    supports = false;
  }

  if (supports) {
    return <Ionicons name={name} size={size} color={color} />;
  }

  return fallback;
};

export default IconFallback;
