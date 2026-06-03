// Firestore sera intégré quand Firebase sera configuré par Personne 1
// Pour l'instant on utilise le backend Spring Boot

export const listenToMessages = (conversationId, callback) => {
  console.log('Firestore non configuré encore - utilisation API REST');
  return () => {};
};

export const sendRealtimeMessage = async (conversationId, message) => {
  console.log('Firestore non configuré encore - utilisation API REST');
};