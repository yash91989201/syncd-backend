export function getCycleLengthDays(cycleLength: string | null): number {
  switch (cycleLength) {
    case "21_24":
      return 21;
    case "25_28":
      return 25;
    case "29_32":
      return 29;
    case "33_plus":
      return 33;
    default:
      return 28;
  }
}

export function getBleedingDays(bleedingDays: string | null): number {
  switch (bleedingDays) {
    case "1_2":
      return 1;
    case "3_4":
      return 3;
    case "5_6":
      return 5;
    case "7_plus":
      return 7;
    default:
      return 5;
  }
}

export function getPhase(
  dayOfCycle: number,
  cycleLength: number,
  bleedingDays: number
): "menstrual" | "follicular" | "ovulation" | "luteal" {
  if (dayOfCycle <= bleedingDays) {
    return "menstrual";
  }

  const ovulationDay = cycleLength - 14;

  if (dayOfCycle < ovulationDay) {
    return "follicular";
  }

  if (dayOfCycle <= ovulationDay + 2) {
    return "ovulation";
  }

  return "luteal";
}
