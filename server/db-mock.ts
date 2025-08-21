// Mock database for frontend testing
export const pool = null;
export const db = {
  select: () => ({ from: () => ({ where: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [{ id: 'test-session', visitorNumber: 1 }] }) }),
  update: () => ({ set: () => ({ where: () => [] }) }),
};