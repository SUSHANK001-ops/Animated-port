import { Connection } from "mongoose";

declare global{
    var mongoose:{
        conn: Connection | null,
        promise: Promise<Connection> | null
       }

    interface Window {
        adsbygoogle?: unknown[]
    }
}

// Add `id` + admin flag to the NextAuth session user.
declare module "next-auth" {
    interface Session {
        user: {
            id?: string
            isAdmin?: boolean
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        isAdmin?: boolean
    }
}

export{}
