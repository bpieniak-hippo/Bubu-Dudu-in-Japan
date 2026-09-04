#!/usr/bin/env python3
"""Skleja index.html + CSS + JS + zdjęcia w jeden samodzielny plik HTML.

Wynik (Bubu-Dudu-Japonia.html) otwiera się dwuklikiem, bez serwera i bez
katalogu assets obok — wszystkie obrazki są osadzone jako data URI.
"""

import base64
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
OUTPUT = ROOT / "Bubu-Dudu-Japonia.html"


def data_uri(path: pathlib.Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def inline_assets(text: str) -> str:
    """Podmienia literały ścieżek 'assets/...' na data URI."""
    # Najdłuższe ścieżki najpierw, żeby prefiksy nie zjadły dłuższych dopasowań.
    for path in sorted(ROOT.glob("assets/**/*.jpg"), key=lambda p: -len(str(p))):
        rel = path.relative_to(ROOT).as_posix()
        if rel in text:
            text = text.replace(rel, data_uri(path))
    return text


def main() -> None:
    css = (ROOT / "css/style.css").read_text(encoding="utf-8")
    data_js = inline_assets((ROOT / "js/data.js").read_text(encoding="utf-8"))
    app_js = (ROOT / "js/app.js").read_text(encoding="utf-8")
    html = inline_assets((ROOT / "index.html").read_text(encoding="utf-8"))

    html = html.replace(
        '<link rel="stylesheet" href="css/style.css" />',
        f"<style>\n{css}\n</style>",
    )
    html = html.replace(
        '<script src="js/data.js"></script>\n  <script src="js/app.js"></script>',
        f"<script>\n{data_js}\n{app_js}\n</script>",
    )

    leftovers = html.count("css/style.css") + html.count("js/data.js") + html.count("js/app.js")
    if leftovers:
        raise SystemExit("Nie udało się wkleić wszystkich zasobów — sprawdź index.html")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"{OUTPUT.name}: {OUTPUT.stat().st_size / 1_048_576:.1f} MB")


if __name__ == "__main__":
    main()
