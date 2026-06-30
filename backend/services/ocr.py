"""
Runtime OCR / text extraction for user uploads.

Accepts a PDF, JPG, or PNG and returns clean text using the same engine as the
knowledge-base builder: digital text via pdfplumber, OCR (tesseract) for
scanned pages or images. Needs system packages `tesseract-ocr` and
`poppler-utils` (see DEPLOY notes). Degrades gracefully if they're absent.
"""
import io
import os
import re
import shutil
import logging
import tempfile
import subprocess

logger = logging.getLogger("janniti.ocr")

_HAS_TESSERACT = shutil.which("tesseract") is not None
_HAS_POPPLER = shutil.which("pdftoppm") is not None


def _clean(t: str) -> str:
    t = re.sub(r"\(cid:\d+\)", "", t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def _ocr_image_bytes(data: bytes) -> str:
    if not _HAS_TESSERACT:
        return ""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        f.write(data); img = f.name
    try:
        out = subprocess.run(["tesseract", img, "stdout", "-l", "eng"],
                             capture_output=True, text=True, timeout=120)
        return out.stdout or ""
    except Exception as e:
        logger.warning(f"image OCR failed: {e}")
        return ""
    finally:
        try: os.unlink(img)
        except OSError: pass


def _extract_pdf(data: bytes) -> str:
    text = ""
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for i, page in enumerate(pdf.pages):
                t = page.extract_text() or ""
                if (len(t.strip()) < 40 or t.count("(cid:") >= 5) and _HAS_POPPLER and _HAS_TESSERACT:
                    t = _ocr_pdf_page(data, i) or t
                text += t + "\n"
    except Exception as e:
        logger.warning(f"pdf extract failed: {e}")
    return text


def _ocr_pdf_page(data: bytes, page_index: int) -> str:
    try:
        with tempfile.TemporaryDirectory() as td:
            pdf_path = os.path.join(td, "in.pdf")
            with open(pdf_path, "wb") as f:
                f.write(data)
            base = os.path.join(td, "pg")
            subprocess.run(["pdftoppm", "-png", "-r", "300", "-f", str(page_index + 1),
                            "-l", str(page_index + 1), pdf_path, base],
                           check=True, capture_output=True, timeout=120)
            import glob
            imgs = sorted(glob.glob(base + "*"))
            if not imgs:
                return ""
            out = subprocess.run(["tesseract", imgs[0], "stdout", "-l", "eng"],
                                 capture_output=True, text=True, timeout=120)
            return out.stdout or ""
    except Exception as e:
        logger.warning(f"pdf page OCR failed: {e}")
        return ""


def extract(filename: str, data: bytes) -> dict:
    """Return {'text', 'method', 'ok'} for an uploaded file."""
    name = (filename or "").lower()
    if name.endswith(".pdf"):
        text = _extract_pdf(data); method = "pdf+ocr"
    elif name.endswith((".png", ".jpg", ".jpeg", ".webp", ".tiff", ".bmp")):
        text = _ocr_image_bytes(data); method = "image-ocr"
    else:
        # try as text
        try:
            text = data.decode("utf-8", errors="ignore"); method = "text"
        except Exception:
            text = ""; method = "unknown"
    text = _clean(text)
    return {"text": text, "method": method, "ok": bool(text),
            "ocr_available": _HAS_TESSERACT and _HAS_POPPLER}
