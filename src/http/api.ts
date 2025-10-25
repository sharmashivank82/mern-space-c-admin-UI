import type { CreatedUserData, Credentials } from "../types";
import { api } from "./client";

// Auth Service Route
export const login = (credentials: Credentials) => api.post('/auth/login', credentials)
export const self = () => api.get('/auth/self')
export const logout = () => api.post('/auth/logout')

export const getUsers = () => api.get('/users')
export const createUsers = (user: CreatedUserData) => api.post("/users/create", user)

export const getTenants = () => api.get("/tenants")
