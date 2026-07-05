import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma, isDbAvailable } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          if (!(await isDbAvailable())) {
            throw new Error("Database connection is offline");
          }
          // First look in Admin table (superadmin)
          const admin = await prisma.admin.findUnique({
            where: { email }
          });

          if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (isPasswordValid) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.fullName,
                role: "ADMIN",
                status: "ACTIVE",
                image: null
              };
            }
          }

          // Then look in User table
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (user) {
            if (user.status !== "ACTIVE") {
              throw new Error("USER_INACTIVE");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.fullName,
                role: user.role,
                status: user.status,
                image: user.image
              };
            }
          }
        } catch (dbError) {
          console.warn("Database connection failed, using local offline fallback credentials:", dbError instanceof Error ? dbError.message : dbError);
          // Fallback bypass: Allow login if the email/password matches the default seed
          if (email === "admin@vista.luxe" && password === "admin") {
            return {
              id: "mock-admin-id",
              email: "admin@vista.luxe",
              name: "VistaLuxe Admin (Offline Mode)",
              role: "ADMIN",
              status: "ACTIVE",
              image: null
            };
          }
          throw dbError;
        }

        return null;
      }
    })
  ]
});
