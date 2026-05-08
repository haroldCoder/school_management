import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradeColor(grade: string): string {
  const numGrade = parseFloat(grade);

  if (numGrade >= 3.5) return "text-green-600";
  if (numGrade >= 2.9) return "text-yellow-600";
  if (numGrade <= 2.8) return "text-red-600";

  return "";
}
