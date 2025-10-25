// src/utils/getGlowColor.ts
import { glowColors } from "@/constants/glowColors";

export function getGlowColor(index: number) {
  return glowColors[index % glowColors.length]; // rota si hay más botones que colores
}
