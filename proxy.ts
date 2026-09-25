import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow the login page itself through, otherwise infinite redirect
      if (req.nextUrl.pathname === "/admin/login") return true;
      return token?.role === "ADMIN";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};