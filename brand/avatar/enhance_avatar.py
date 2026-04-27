"""
Migliora qualità grafica + ritocco soft del volto via fal.ai Clarity Upscaler.
Mantiene i lineamenti originali (creativity bassa, resemblance alta).

Uso:
  1. Trascina le foto in brand/avatar/originali/
  2. python brand/avatar/enhance_avatar.py
  3. Risultati in brand/avatar/enhanced/
"""

import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

import fal_client
from dotenv import load_dotenv
from PIL import Image
import requests

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "originali"
DST = ROOT / "enhanced"

load_dotenv(ROOT.parent.parent / ".env")
if not os.getenv("FAL_KEY"):
    sys.exit("FAL_KEY non trovata in .env")

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}

PROMPT = (
    "professional editorial portrait, sharp natural skin texture, "
    "clean even skin tone, cinematic color grading, high detail eyes, "
    "preserve exact facial features and proportions, photorealistic"
)

BASE_PARAMS = {
    "prompt": PROMPT,
    "creativity": 0.25,
    "resemblance": 0.75,
    "guidance_scale": 4,
    "num_inference_steps": 18,
}

MAX_OUTPUT_MP = 30  # margine sotto il limite di 32 MP del modello


def safe_upload(img_path: Path) -> tuple[str, int]:
    """Sceglie upscale_factor in base all'input.
    Limite fal: output (input_MP * upscale^2) <= 32 MP.
    - input ≤ 8 MP  → upscale 2x (raddoppio)
    - input ≤ 30 MP → upscale 1x (solo enhance, no raddoppio)
    - input > 30 MP → resize a 30 MP, upscale 1x
    Inoltre rinomina file con caratteri non-ASCII per upload."""
    with Image.open(img_path) as im:
        w, h = im.size
    mp = (w * h) / 1024 ** 2

    src = img_path
    cleanup_tmp: Path | None = None

    if mp > MAX_OUTPUT_MP:
        scale = (MAX_OUTPUT_MP / mp) ** 0.5
        new_size = (int(w * scale), int(h * scale))
        print(f"  resize {w}x{h} → {new_size[0]}x{new_size[1]} (era {mp:.1f} MP)")
        tmp = Path(tempfile.gettempdir()) / f"avatar_{os.getpid()}_{img_path.stem}.png"
        tmp = Path(str(tmp).replace(" ", "_"))
        with Image.open(img_path) as im:
            im = im.convert("RGBA" if img_path.suffix.lower() == ".png" else "RGB")
            im.thumbnail(new_size, Image.LANCZOS)
            im.save(tmp)
        src = tmp
        cleanup_tmp = tmp
        upscale = 1
    elif mp * 4 <= MAX_OUTPUT_MP:
        upscale = 2
    else:
        upscale = 1

    safe_name = re.sub(r"[^A-Za-z0-9._-]", "_", src.name)
    if safe_name != src.name:
        tmp2 = Path(tempfile.gettempdir()) / f"avatar_{os.getpid()}_{safe_name}"
        shutil.copy2(src, tmp2)
        url = fal_client.upload_file(str(tmp2))
        tmp2.unlink(missing_ok=True)
    else:
        url = fal_client.upload_file(str(src))

    if cleanup_tmp:
        cleanup_tmp.unlink(missing_ok=True)
    return url, upscale


def process(img_path: Path) -> None:
    out = DST / f"{img_path.stem}_enhanced.png"
    if out.exists():
        print(f"  skip (exists): {out.name}")
        return

    print(f"→ {img_path.name}")
    url, upscale = safe_upload(img_path)
    print(f"  enhance (upscale {upscale}x)…")
    result = fal_client.subscribe(
        "fal-ai/clarity-upscaler",
        arguments={"image_url": url, "upscale_factor": upscale, **BASE_PARAMS},
        with_logs=False,
    )

    out_url = result["image"]["url"]
    print(f"  download → {out.name}")
    out.write_bytes(requests.get(out_url, timeout=180).content)


def main() -> None:
    DST.mkdir(exist_ok=True)
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        sys.exit(f"Nessuna foto in {SRC}")

    print(f"Trovate {len(files)} foto.\n")
    for f in files:
        try:
            process(f)
        except Exception as e:
            print(f"  ERRORE su {f.name}: {e}")
    print("\nFatto.")


if __name__ == "__main__":
    main()
