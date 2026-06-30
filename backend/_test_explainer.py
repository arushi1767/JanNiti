
from dotenv import load_dotenv

load_dotenv()

from services.ai_service import generate_explainer

r = generate_explainer("PM-KISAN", "hi")

print("WHY=", r.why_introduced[:200])

print("BENEFIT0=", (r.benefits[0] if r.benefits else "NONE"))

