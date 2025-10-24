// Firestore Collection Names and Paths
// This file centralizes all collection references for easy maintenance

export const COLLECTIONS = {
  MEMBERS: 'members',
  CAMPS: 'camps',
  ROLES: 'roles',
  SETTINGS: 'settings',
  AUDIT_LOGS: 'audit_logs',
} as const;

// Helper function to get camp sub-collections
export const getCampCollections = (campId: string) => ({
  REGISTRATIONS: `${COLLECTIONS.CAMPS}/${campId}/registrations`,
  PAYMENTS: `${COLLECTIONS.CAMPS}/${campId}/payments`,
  ANNOUNCEMENTS: `${COLLECTIONS.CAMPS}/${campId}/announcements`,
  DEVOTIONALS: `${COLLECTIONS.CAMPS}/${campId}/devotionals`,
  GAMES: `${COLLECTIONS.CAMPS}/${campId}/games`,
});

// Current active camp
export const CURRENT_CAMP = 'YC26';
