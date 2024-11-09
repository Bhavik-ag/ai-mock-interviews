import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { apiAuthPrefix } from "./app/routes";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const isApiAuthRoute = apiAuthPrefix.some((prefix) =>
    nextUrl.pathname.startsWith(prefix),
  );

  const {
    data: { user },
  } = await createSupabaseServerClient().auth.getUser();

  await updateSession(request);

  if (isApiAuthRoute) {
    return;
  }

  if (!user) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
