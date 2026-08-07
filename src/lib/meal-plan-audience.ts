import type { MealAttendance } from '@/lib/shared-state-repository';

export function getEffectiveMealPlanMemberIds(
  storedMemberIds: string[],
  familyMemberIds: string[],
  attendance: MealAttendance[string] | undefined,
) {
  if (storedMemberIds.length > 0) return storedMemberIds;

  const attendingMemberIds = familyMemberIds.filter(
    (memberId) => attendance?.[memberId] !== false,
  );

  return attendingMemberIds.length > 0
    ? attendingMemberIds
    : familyMemberIds;
}
