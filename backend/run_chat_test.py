import traceback
from services import ai_service

try:
    res = ai_service.chat_with_ai('hello', conversation_history=[], language='en')
    print('RESULT:', res)
except Exception as e:
    print('EXCEPTION:', e)
    traceback.print_exc()
