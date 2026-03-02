import os
import shutil
import json

SET_SUFFIXES = [
    "-nullifying-zero",
    "-mega-dream-ex",
    "-inferno-x",
]

CARDS_DIR = "cards"
OUTPUT_DIR = "cards_by_pokemon"
MAPPING_FILE = "card_mapping.json"

os.makedirs(OUTPUT_DIR, exist_ok=True)

mapping = {}

for filename in os.listdir(CARDS_DIR):
    if not filename.endswith(".webp"):
        continue

    name = filename.replace(".webp", "")

    pokemon_name = name
    for suffix in SET_SUFFIXES:
        if name.endswith(suffix):
            pokemon_name = name[: -len(suffix)]
            break

    display_name = " ".join(
        word.upper() if word in ("ex", "gx", "v", "vmax", "vstar") else word.capitalize()
        for word in pokemon_name.split("-")
    )

    src = os.path.join(CARDS_DIR, filename)
    pokemon_folder = os.path.join(OUTPUT_DIR, pokemon_name)
    os.makedirs(pokemon_folder, exist_ok=True)
    dest = os.path.join(pokemon_folder, filename)
    shutil.copy2(src, dest)

    if display_name not in mapping:
        mapping[display_name] = []
    mapping[display_name].append(dest)

    print(f"  {filename}  ->  {display_name}")

with open(MAPPING_FILE, "w", encoding="utf-8") as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)

print(f"\nDone! {len(mapping)} Pokemon mapped.")
print(f"Images organized in: {OUTPUT_DIR}/")
print(f"Full mapping saved to: {MAPPING_FILE}")
