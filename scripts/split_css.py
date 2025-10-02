from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source_css = ROOT / "css" / "main.css"
if not source_css.exists():
    raise SystemExit("css/main.css not found")

content = source_css.read_text(encoding="utf-8")

root_start = content.find(":root")
if root_start == -1:
    raise SystemExit(":root block not found")
block_start = content.find("{", root_start)
stack = 0
end_index = None
for idx in range(block_start, len(content)):
    char = content[idx]
    if char == "{":
        stack += 1
    elif char == "}":
        stack -= 1
        if stack == 0:
            end_index = idx + 1
            break

if end_index is None:
    raise SystemExit("Could not close :root block")

tokens = content[:end_index].strip() + "\n"
rest = content[end_index:].lstrip()

styles_dir = ROOT / "src" / "styles"
styles_dir.mkdir(parents=True, exist_ok=True)

(styles_dir / "tokens.css").write_text(tokens, encoding="utf-8")
(styles_dir / "base.css").write_text(rest, encoding="utf-8")

print("Tokens and base CSS written.")
