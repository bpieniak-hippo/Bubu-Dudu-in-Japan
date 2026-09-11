#!/usr/bin/env python3
"""Wkleja adres i klucz bazy do index.html podczas publikacji na Netlify.

Dzięki temu telefon podłącza się do wspólnej bazy sam, samym wejściem na adres —
nikt nie przepisuje długiego klucza z panelu Supabase. Wartości biorą się ze
zmiennych środowiskowych ustawionych w Netlify, więc nie ma ich w repozytorium.

Uruchamiane wyłącznie na Netlify, na świeżej kopii repo — plik w katalogu
roboczym zostaje nietknięty.
"""

import json
import os
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
INDEX = ROOT / "index.html"
ANCHOR = '<script src="js/data.js"></script>'


def main() -> None:
    url = os.environ.get("SUPABASE_URL", "").strip()
    key = os.environ.get("SUPABASE_ANON_KEY", "").strip()

    if not url or not key:
        print("SUPABASE_URL / SUPABASE_ANON_KEY nie ustawione — publikuję bez wbudowanej bazy.")
        return

    html = INDEX.read_text(encoding="utf-8")
    if ANCHOR not in html:
        raise SystemExit(f"Nie znalazłem {ANCHOR} w index.html — nie mam gdzie wstawić ustawień.")

    # json.dumps ucieka cudzysłowy i znaki specjalne, a podmiana "</" chroni przed
    # przedwczesnym zamknięciem znacznika, gdyby wartość zawierała "</script>".
    payload = json.dumps({"url": url, "key": key}, ensure_ascii=False).replace("</", "<\\/")
    html = html.replace(ANCHOR, f"<script>window.BUBU_SYNC = {payload};</script>\n  {ANCHOR}", 1)

    INDEX.write_text(html, encoding="utf-8")
    print(f"Wbudowano adres bazy: {url}")


if __name__ == "__main__":
    main()
