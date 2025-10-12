import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Tenant {
    id: number,
    name: string,
    address: string,
}

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    createdAt: string,
    tenant?: Tenant
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools((set) => {
        
        return {
            user: null,
            setUser: (userDetails) => set({ user: userDetails }),
            logout: () => set({ user: null })
        }
    })
)