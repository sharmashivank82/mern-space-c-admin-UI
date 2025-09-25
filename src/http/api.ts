import type { Credentials } from "../types";
import { api } from "./client";

// Auth Service Route
export const login = (credentials: Credentials) => api.post('/auth/login', credentials)