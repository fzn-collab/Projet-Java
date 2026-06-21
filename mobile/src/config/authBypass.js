// TODO: BYPASS TEMPORAIRE - À RETIRER avant la mise en prod
// Mettre à false pour utiliser Firebase Auth (recommandé)
export const SKIP_AUTH = false;

/** Utilisateur fictif — forme compatible Firebase User (uid, email, displayName) */
export const MOCK_USER = {
  uid: "user_test_123",
  email: "aya.connecto@connecto.app",
  displayName: "Aya Benali",
  emailVerified: true,
};

/** Profil métier cohérent avec le backend Spring Boot */
export const MOCK_PROFILE = {
  id: "user_test_123",
  userId: "user_test_123",
  firebaseUid: "user_test_123",
  nom: "Aya Benali",
  email: "aya.connecto@connecto.app",
  secteur: "FinTech",
  besoin: "Co-fondateur technique",
  competences: ["React", "Node.js", "Product Management", "FinTech"],
  localisation: {
    ville: "Casablanca",
    pays: "Maroc",
  },
};
