#!/usr/bin/env node
// Crawls every internal href reachable from "/" against a running dev/prod server
// and fails if any of them do not return 2xx/3xx. This is the "no link 404s" check
// called for across the VF-ICG-REV-001 review (B-01 acceptance, DoD 12.2) — there is
// no test framework in this repo to hook it into, so it runs as a standalone script.
//
// Usage: node scripts/crawl-links.mjs [baseUrl]
//   BASE_URL env var or first arg overrides the default http://localhost:3000

const base = process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3000"

const visited = new Set()
const queue = ["/"]
const broken = []

function extractHrefs(html) {
  const hrefs = new Set()
  for (const m of html.matchAll(/href="([^"]+)"/g)) hrefs.add(m[1])
  return [...hrefs].filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0])
}

while (queue.length > 0) {
  const path = queue.shift()
  if (visited.has(path)) continue
  visited.add(path)

  let res
  try {
    res = await fetch(base + path, { redirect: "manual" })
  } catch (err) {
    broken.push({ path, reason: String(err) })
    continue
  }

  if (res.status >= 400) {
    broken.push({ path, reason: `HTTP ${res.status}` })
    continue
  }

  if (res.status >= 300 && res.status < 400) continue // don't follow redirects into the crawl frontier blindly

  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("text/html")) continue

  const html = await res.text()
  for (const href of extractHrefs(html)) {
    if (!visited.has(href)) queue.push(href)
  }
}

console.log(`Crawled ${visited.size} internal URLs from ${base}`)
if (broken.length > 0) {
  console.error(`\n${broken.length} broken link(s):`)
  for (const b of broken) console.error(`  ${b.path} — ${b.reason}`)
  process.exit(1)
}
console.log("No broken internal links found.")
