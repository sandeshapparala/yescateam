/**
 * YESCA Team Cloud Functions
 * Handles server-side operations for youth camp management
 */

import {setGlobalOptions} from "firebase-functions";
import {onDocumentCreated, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options for cost control
setGlobalOptions({
  maxInstances: 10,
  region: "asia-south1", // India region for better performance
});

// ===== HELPER FUNCTIONS =====

/**
 * Check if user has admin role
 */
async function isAdmin(uid: string): Promise<boolean> {
  try {
    const roleDoc = await admin.firestore().collection("roles").doc(uid).get();
    if (!roleDoc.exists) return false;
    const role = roleDoc.data()?.role;
    return ["super_admin", "admin"].includes(role);
  } catch (error) {
    logger.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Generate unique member ID
 */
function generateMemberId(counter: number): string {
  return `YESCA${String(counter).padStart(4, "0")}`;
}

/**
 * Generate unique registration ID
 */
function generateRegistrationId(campId: string, counter: number): string {
  return `${campId}-${String(counter).padStart(4, "0")}`;
}

// ===== CLOUD FUNCTIONS =====

/**
 * Trigger: When a new registration is created
 * Action: Create audit log
 */
export const onRegistrationCreated = onDocumentCreated(
  "camps/{campId}/registrations/{registrationId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const {campId, registrationId} = event.params;

    logger.info(`New registration created: ${registrationId} for camp ${campId}`);

    // Create audit log
    await admin.firestore().collection("audit_logs").add({
      action: "registration_created",
      collection: "registrations",
      target_id: registrationId,
      camp_id: campId,
      new_value: data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      source: "system",
    });
  }
);

/**
 * Trigger: When a member is linked to a registration
 * Action: Update member's registered_camps array and last_registered_camp
 */
export const onRegistrationLinked = onDocumentUpdated(
  "camps/{campId}/registrations/{registrationId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Check if registration was just linked
    if (!before.linked && after.linked && after.linked_member_id) {
      const {campId} = event.params;
      const memberId = after.linked_member_id;

      logger.info(`Registration linked to member: ${memberId}`);

      // Update member document
      const memberRef = admin.firestore().collection("members").doc(memberId);

      await memberRef.update({
        registered_camps: admin.firestore.FieldValue.arrayUnion(campId),
        last_registered_camp: campId,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(`Member ${memberId} updated with camp ${campId}`);
    }
  }
);

/**
 * Callable Function: Get next member ID
 * Requires: Admin authentication
 */
export const getNextMemberId = onCall(async (request) => {
  // Check authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  // Check admin role
  const adminCheck = await isAdmin(request.auth.uid);
  if (!adminCheck) {
    throw new HttpsError("permission-denied", "User must be an admin");
  }

  // Get and increment counter
  const counterRef = admin.firestore().collection("settings").doc("counters");
  const counterDoc = await counterRef.get();

  let counter = 1;
  if (counterDoc.exists) {
    counter = (counterDoc.data()?.member_counter || 0) + 1;
  }

  // Update counter
  await counterRef.set(
    {member_counter: counter},
    {merge: true}
  );

  const memberId = generateMemberId(counter);

  logger.info(`Generated new member ID: ${memberId}`);

  return {memberId, counter};
});

/**
 * Callable Function: Get next registration ID for a camp
 * Requires: Authentication (can be public for online registration)
 */
export const getNextRegistrationId = onCall(async (request) => {
  const {campId} = request.data;

  if (!campId) {
    throw new HttpsError("invalid-argument", "Camp ID is required");
  }

  // Get and increment counter
  const counterRef = admin.firestore().collection("settings").doc("counters");
  const counterDoc = await counterRef.get();

  const counterKey = `registration_counter_${campId}`;
  let counter = 1;

  if (counterDoc.exists) {
    counter = (counterDoc.data()?.[counterKey] || 0) + 1;
  }

  // Update counter
  await counterRef.set(
    {[counterKey]: counter},
    {merge: true}
  );

  const registrationId = generateRegistrationId(campId, counter);

  logger.info(`Generated new registration ID: ${registrationId}`);

  return {registrationId, counter};
});

/**
 * Callable Function: Search members by phone number
 */
export const searchMemberByPhone = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const {phoneNumber} = request.data;

  if (!phoneNumber) {
    throw new HttpsError("invalid-argument", "Phone number is required");
  }

  const snapshot = await admin.firestore()
    .collection("members")
    .where("phone_number", "==", phoneNumber)
    .get();

  const members = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {members};
});

// ===== EXAMPLE FUNCTION (commented out) =====
// Uncomment when ready to test

// export const helloYesca = onRequest((request, response) => {
//   logger.info("YESCA Team says hello!", {structuredData: true});
//   response.send("Hello from YESCA Team!");
// });
