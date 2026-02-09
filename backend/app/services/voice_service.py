import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class VoiceService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not set for VoiceService.")
            self.model = None
        else:
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-flash-latest')
            except Exception as e:
                print(f"Gemini Config Error: {e}")
                self.model = None

    async def processed_advocate_response(self, user_input: str, history: list = []):
        if not self.model:
             # Mock response for testing without API key
            return f"I am The Advocate (Mock). You said: '{user_input}'. Under current immigration laws, you have the right to speak."

        try:
            # Construct a chat session with history + system context
            # Note: Gemini 1.5 Flash supports system instructions in the model init, 
            # but for per-session context we might just prepend it.
            
            system_instruction = """
            You are "The Advocate", an AI assistant for refugees. 
            Your goal is to listen to interactions (or user descriptions) and provide immediate, 
            legally-grounded advice or "scripts" they can say to text/voice.
            
            Context: The user is likely in a high-stress bureaucratic situation (Visa office, Landlord, Police).
            
            Guidelines:
            1. Be concise. Real-time requires short, punchy answers.
            2. Be empowering but polite. Give the user the *exact words* to say.
            3. Cite specific rights if possible (e.g., "Under Article 16a...").
            4. If the user is being mistreated, suggest a de-escalation or demand for a supervisor.
            """
            
            chat = self.model.start_chat(history=history)
            response = await chat.send_message_async(f"{system_instruction}\n\nUser Input: {user_input}")
            return response.text
            
        except Exception as e:
            print(f"Voice Service Error: {e}")
            return f"DEBUG ERROR: {e}"

voice_service = VoiceService()
