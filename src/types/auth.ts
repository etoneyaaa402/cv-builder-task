import { UserRole } from "@/generated/graphql";

export type SessionData = {
    userId: string;
    role: UserRole;
    accessToken: string;
    refreshToken: string;
};
