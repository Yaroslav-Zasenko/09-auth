// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Якщо немає accessToken, але є refreshToken — намагаємося оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      // Якщо сервер повернув нові куки або сесія валідна, оновлюємо accessToken
      if (response && response.status === 200) {
        accessToken = cookieStore.get("accessToken")?.value;
      }
    } catch {
      // Якщо оновлення сесії не вдалося — ігноруємо, користувач лишається неавторизованим
    }
  }

  // Прапорець автентифікації тепер базується лише на accessToken
  const isAuthenticated = Boolean(accessToken);

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !isAuthenticated && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && isAuthenticated && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
