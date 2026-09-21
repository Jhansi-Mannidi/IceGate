// The environment indicator is derived from build configuration only — it must
// never be settable from within the running app (no toggle, no user input).
const rawEnv = process.env.NEXT_PUBLIC_ICEGATE_ENV?.toUpperCase()
const usesTestCredentials = process.env.NEXT_PUBLIC_ICEGATE_USE_TEST_CREDENTIALS === "true"

export type IcegateEnvironment = "UAT" | "PRODUCTION"

export const icegateEnvironment: IcegateEnvironment = rawEnv === "PRODUCTION" ? "PRODUCTION" : "UAT"

// A production build carrying the test/UAT credential indicator is exactly the
// category of incident this badge exists to prevent — refuse to start rather
// than render a wrong badge.
if (icegateEnvironment === "PRODUCTION" && usesTestCredentials) {
  throw new Error(
    "Refusing to start: NEXT_PUBLIC_ICEGATE_ENV=PRODUCTION but NEXT_PUBLIC_ICEGATE_USE_TEST_CREDENTIALS=true. " +
      "A production build must not carry the test/UAT indicator.",
  )
}
