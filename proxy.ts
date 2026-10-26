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

  const response = NextResponse.next();

  // Якщо немає accessToken, але є refreshToken — намагаємося оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const apiResponse = await checkSession();

      // Отримуємо заголовки Set-Cookie з відповіді сервера
      const setCookieHeader =
        apiResponse.headers?.["set-cookie"] ||
        (apiResponse as unknown as Response)?.headers?.get?.("set-cookie");

      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookiesArray.forEach((cookieStr) => {
          const [cookiePair] = cookieStr.split(";");
          const [name, value] = cookiePair.split("=");
          if (name && value) {
            cookieStore.set(name.trim(), value.trim());
            response.cookies.set(name.trim(), value.trim());
          }
        });

        accessToken = cookieStore.get("accessToken")?.value;
      }
    } catch {
      // Якщо оновлення сесії не вдалося — залишаємося неавторизованими
    }
  }

  // Прапорець автентифікації базується виключно на наявності accessToken
  const isAuthenticated = Boolean(accessToken);

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !isAuthenticated && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && isAuthenticated && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
