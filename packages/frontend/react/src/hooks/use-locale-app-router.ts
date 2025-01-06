import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { LocaleType } from "../locales"

export const useSwitchLocaleInAppRouter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (newLocale: LocaleType) => {
    // Create a new URL with the current pathname and search params
    const url = new URL(pathname, window.location.origin)
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value)
    })

    // Add or update the locale in the URL
    url.pathname = `/${newLocale}${pathname}`

    // Navigate to the new URL
    void router.push(url.toString())
  }
}
