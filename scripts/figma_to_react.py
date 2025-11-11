# scripts/figma_to_react.py
import os
import sys
import json
import re
import requests
import difflib

# ---------------------------------------
# ✅ Ensure UTF-8 encoding on Windows
# ---------------------------------------
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

FIGMA_TOKEN = os.getenv("FIGMA_ACCESS_TOKEN")
HEADERS = {"X-Figma-Token": FIGMA_TOKEN}

# ---------------------------------------
# 🧠 Step 1: Clean user query
# ---------------------------------------
def clean_query(prompt: str) -> str:
    """Extract concise keyword from a long natural-language prompt."""
    prompt = prompt.lower().strip()
    prompt = re.sub(
        r"(generate|react|code|for|component|page|figma|ui|design|please|create|a|an|the|from)",
        " ",
        prompt,
    )
    prompt = re.sub(r"\s+", " ", prompt)
    return prompt.strip()

# ---------------------------------------
# 🧩 Step 2: Fetch Figma document structure
# ---------------------------------------
def fetch_figma_file(file_key: str):
    url = f"https://api.figma.com/v1/files/{file_key}"
    r = requests.get(url, headers=HEADERS)
    r.raise_for_status()
    return r.json()

# ---------------------------------------
# 🧩 Step 3: Collect components recursively
# ---------------------------------------
def collect_components(figma_json):
    comps = []

    def walk(node):
        name = node.get("name", "")
        ntype = node.get("type", "")
        if ntype in ["FRAME", "COMPONENT", "COMPONENT_SET"]:
            comps.append({"id": node["id"], "name": name})
        for c in node.get("children", []):
            walk(c)

    walk(figma_json["document"])
    return comps

# ---------------------------------------
# 🧩 Step 4: Fetch image export URLs
# ---------------------------------------
def fetch_image(file_key: str, node_id: str):
    url = f"https://api.figma.com/v1/images/{file_key}"
    params = {"ids": node_id, "format": "png"}
    r = requests.get(url, headers=HEADERS, params=params)
    r.raise_for_status()
    images = r.json().get("images", {})
    return images.get(node_id, "")

# ---------------------------------------
# 🧩 Step 5: Main logic
# ---------------------------------------
if __name__ == "__main__":
    try:
        data = json.loads(sys.stdin.read() or "{}")
        file_key = data.get("file_key")
        raw_query = (data.get("query") or "").lower()

        if not file_key:
            print(json.dumps({"error": "❌ No file_key provided"}))
            sys.exit(1)

        if not FIGMA_TOKEN:
            print(json.dumps({"error": "❌ No FIGMA_ACCESS_TOKEN found in environment"}))
            sys.exit(1)

        query = clean_query(raw_query)
        if not query:
            print(json.dumps({"error": f"Invalid query: '{raw_query}'"}))
            sys.exit(1)

        # Fetch Figma data
        design = fetch_figma_file(file_key)
        components = collect_components(design)
        if not components:
            print(json.dumps({"error": "No components found in Figma file"}))
            sys.exit(1)

        # Prepare lowercase names for fuzzy matching
        names_lower = [c["name"].lower() for c in components]

        # Try direct match or substring
        matches = [c for c in components if query in c["name"].lower()]

        # If no direct match, fuzzy match (close name)
        if not matches:
            close = difflib.get_close_matches(query, names_lower, n=3, cutoff=0.55)
            matches = [
                c for c in components if c["name"].lower() in close
            ] if close else []

        # Handle no results
        if not matches:
            print(json.dumps({
                "found": False,
                "message": f"No components found matching '{query}'",
                "available": sorted(set([c["name"] for c in components]))[:50]
            }))
            sys.exit(0)

        # Use top match (most similar)
        best_match = matches[0]
        img_url = fetch_image(file_key, best_match["id"])

        # Handle empty image
        if not img_url:
            print(json.dumps({
                "found": True,
                "component": best_match["name"],
                "image_url": None,
                "warning": "⚠️ Image not available (Figma export issue)"
            }))
            sys.exit(0)

        # ✅ Final JSON result (sent back to TypeScript)
        print(json.dumps({
            "found": True,
            "component": best_match["name"],
            "image_url": img_url
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
