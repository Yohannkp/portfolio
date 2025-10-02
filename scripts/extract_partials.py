import json
from collections import defaultdict
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"
PARTIALS_DIR = ROOT / "src" / "templates" / "partials"
LAYOUTS_DIR = ROOT / "src" / "templates" / "layouts"

PARTIALS_DIR.mkdir(parents=True, exist_ok=True)
LAYOUTS_DIR.mkdir(parents=True, exist_ok=True)

html_text = INDEX_PATH.read_text(encoding="utf-8", errors="replace")
soup = BeautifulSoup(html_text, "html.parser")

(PARTIALS_DIR / "head.njk").write_text(str(soup.head), encoding="utf-8")

header_el = soup.body.find("header")
if header_el:
    (PARTIALS_DIR / "header.njk").write_text(str(header_el), encoding="utf-8")

footer_el = soup.body.find("footer", class_="site-footer")
if footer_el:
    (PARTIALS_DIR / "footer.njk").write_text(str(footer_el), encoding="utf-8")

scripts_html = [str(script) for script in soup.find_all("script")]
(PARTIALS_DIR / "scripts.njk").write_text("\n".join(scripts_html), encoding="utf-8")

main_el = soup.body.find("main")
section_files = []
name_counts = defaultdict(int)

if main_el:
    for idx, child in enumerate(main_el.children, start=1):
        if getattr(child, "name", None) is None:
            continue
        html = str(child)
        if child.name == "section":
            section_id = child.get("id") or f"section-{idx}"
            base_name = f"section-{section_id}"
        else:
            base_name = f"block-{idx}-{child.name}"
        name_counts[base_name] += 1
        filename = base_name if name_counts[base_name] == 1 else f"{base_name}-{name_counts[base_name]}"
        filename = f"{filename}.njk"
        (PARTIALS_DIR / filename).write_text(html, encoding="utf-8")
        section_files.append(filename)

layout_template = """<!DOCTYPE html>
<html lang=\"fr\">
  {% include \"partials/head.njk\" %}
  <body>
    {% include \"partials/header.njk\" %}
    <main id=\"top\">
{% for partial in sectionPartials %}
      {% include \"partials/\" ~ partial %}
{% endfor %}
    </main>
    {% include \"partials/footer.njk\" %}
    {% include \"partials/scripts.njk\" %}
  </body>
</html>
"""

(LAYOUTS_DIR / "base.njk").write_text(layout_template, encoding="utf-8")

sections_json_path = ROOT / "src" / "data" / "sections.json"
sections_json_path.write_text(json.dumps({"index": section_files}, indent=2, ensure_ascii=False), encoding="utf-8")

print(f"Extracted {len(section_files)} partial sections.")
