#!/usr/bin/env bash
# Checks that a Cloudflare deployment of the site serves it: tools/cloudflare-check.sh <url> <kind>
#
#   preview  a branch Preview: the preview bar, and X-Robots-Tag: noindex
#   live     the live site: no preview bar, no X-Robots-Tag, and this commit's build
#
# Used by .github/workflows/preview.yml (Previews) and ci.yml's deploy job (the live site).
set -uo pipefail

url="${1:?usage: cloudflare-check.sh <url> <preview|live>}"
kind="${2:?usage: cloudflare-check.sh <url> <preview|live>}"
url="${url%/}"

# A new address can take a few seconds to answer everywhere.
for _ in 1 2 3 4 5 6; do curl -fsS -o /dev/null "$url/" && break; sleep 5; done

status() { curl -sS -o /dev/null -w '%{http_code}' "$url$1"; }
count() { grep -ci -- "$1" || true; }
fail=0
check() {
  if [ "$2" = "$3" ]; then
    echo "ok   $1"
  else
    echo "::error title=Cloudflare::$url: $1: expected $3, got $2"
    fail=1
  fi
}

home="$(curl -sS "$url/")"
check "home page" "$(status /)" 200
check "a service page" "$(status /services/health-check/)" 200
check "/about redirects to /about/" "$(status /about | cut -c1-2)" 30
check "unknown page" "$(status /no-such-page/)" 404
check "home page title" "$(count '<title>' <<< "$home")" 1
check "headers from cloudflare/_headers" "$(curl -sSI "$url/" | count '^x-content-type-options: nosniff')" 1

noindex="$(curl -sSI "$url/" | count '^x-robots-tag: noindex')"
bar="$(count 'aria-label="Branch preview"' <<< "$home")"
case "$kind" in
  preview)
    check "noindex header" "$noindex" 1
    check "preview bar" "$bar" 1
    ;;
  live)
    check "no noindex header" "$noindex" 0
    check "no preview bar" "$bar" 0
    if [ -n "${GITHUB_SHA:-}" ]; then
      check "this commit's build" "$(count "data-commit=\"$GITHUB_SHA\"" <<< "$home")" 1
    fi
    ;;
  *)
    echo "unknown kind: $kind" >&2
    exit 2
    ;;
esac
exit "$fail"
