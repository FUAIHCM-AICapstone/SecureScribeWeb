/**
 * Check if a user is the owner (creator) of a meeting
 * @param userId - The current user's ID (can be null or undefined)
 * @param meetingCreatedBy - The ID of the user who created the meeting
 * @returns true if the user is the meeting owner, false otherwise
 */
export function isUserMeetingOwner(
    userId: string | null | undefined,
    meetingCreatedBy: string
): boolean {
    return !!userId && userId === meetingCreatedBy;
}
