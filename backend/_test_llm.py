from dotenv import load_dotenv
load_dotenv()
import config
print("PROVIDER=", config.LLM_PROVIDER)
print("MODEL=", repr(config.ANTHROPIC_MODEL))
print("MAXTOK=", config.LLM_MAX_TOKENS)
from services.llm import llm_chat
r = llm_chat(messages=[{"role":"user","content":"Return a JSON object with keys a and b. a is 1, b is the word hi."}], json_mode=True)
print("LEN=", len(r))
print("REPR=", repr(r[:600]))
