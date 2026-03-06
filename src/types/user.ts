import { UserRole } from "@/generated/graphql";

export type User = {
    id: string;
    email: string;
    role: UserRole;
    department_name?: string | null;
    position_name?: string | null;
    profile: {
        first_name?: string | null;
        last_name?: string | null;
        avatar?: string | null;
    };
};
