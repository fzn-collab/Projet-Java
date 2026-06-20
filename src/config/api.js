import { Platform } from "react-native";

/** Adresse du backend Spring Boot — modifier selon votre environnement. */
const LAN_IP = "192.168.0.115";
const PORT = 8083;

function resolveApiUrl() {
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}`;
  }
  if (Platform.OS === "web") {
    return `http://localhost:${PORT}`;
  }
  return `http://${LAN_IP}:${PORT}`;
}

export const API_URL = resolveApiUrl();
