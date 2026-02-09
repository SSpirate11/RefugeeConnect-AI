import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

# In-memory storage for MVP (session-based)
user_profiles = {}

class NavigatorService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not set for NavigatorService.")
            self.model = None
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')

    async def extract_life_graph(self, conversation_text: str, user_id: str):
        """Extract structured profile from conversational input"""
        if not self.model:
            # Mock response
            profile = {
                "name": "Sample User",
                "nationality": "Syria",
                "current_country": "Germany",
                "profession": "Doctor",
                "family": {"children": 2},
                "status": "Asylum Seeker"
            }
        else:
            try:
                prompt = f"""
                Extract structured information from this conversation into a JSON Life Graph.
                
                Conversation:
                {conversation_text}
                
                Return ONLY valid JSON with these fields (use null if not mentioned):
                {{
                    "name": string,
                    "age": number,
                    "nationality": string,
                    "current_country": string,
                    "profession": string,
                    "education": string,
                    "family": {{"spouse": bool, "children": number}},
                    "status": string (refugee/asylum_seeker/displaced),
                    "languages": [string],
                    "needs": [string]
                }}
                """
                
                response = await self.model.generate_content_async(prompt)
                text = response.text.replace("```json", "").replace("```", "").strip()
                profile = json.loads(text)
                
            except Exception as e:
                print(f"Navigator Service Error: {e}")
                return {"error": str(e)}

        # Persist to DB
        from sqlmodel import Session, select
        from app.database import engine
        from app.models import NavigatorProfile
        import uuid

        with Session(engine) as session:
            # Check existing
            statement = select(NavigatorProfile).where(NavigatorProfile.user_id == uuid.UUID(user_id))
            results = session.exec(statement)
            existing_profile = results.first()
            
            profile_str = json.dumps(profile)
            
            if existing_profile:
                existing_profile.profile_json = profile_str
                existing_profile.updated_at = datetime.utcnow()
                session.add(existing_profile)
            else:
                new_profile = NavigatorProfile(user_id=uuid.UUID(user_id), profile_json=profile_str)
                session.add(new_profile)
            
            session.commit()
            
        return profile

    async def get_profile(self, user_id: str):
        """Retrieve stored profile"""
        from sqlmodel import Session, select
        from app.database import engine
        from app.models import NavigatorProfile
        import uuid

        with Session(engine) as session:
            statement = select(NavigatorProfile).where(NavigatorProfile.user_id == uuid.UUID(user_id))
            results = session.exec(statement)
            profile_db = results.first()
            
            if profile_db:
                return json.loads(profile_db.profile_json)
            return None

    async def get_form_assistance(self, query: str, user_id: str):
        """Provide form assistance based on profile"""
        profile = await self.get_profile(user_id)
        if not profile:
            profile = {}
        
        if not self.model:
            return f"Mock: Based on your profile as a {profile.get('profession', 'professional')} from {profile.get('nationality', 'your country')}, here's what you need for '{query}'..."

        try:
            prompt = f"""
            You are a bureaucracy navigator for refugees.
            
            User Profile:
            {json.dumps(profile, indent=2)}
            
            User Query: {query}
            
            Provide:
            1. Specific forms/documents needed
            2. Which information from their profile applies
            3. What's missing and needs to be obtained
            4. Step-by-step guidance
            
            Be concise and actionable.
            """
            
            response = await self.model.generate_content_async(prompt)
            return response.text
            
        except Exception as e:
            print(f"Form Assistance Error: {e}")
            return f"DEBUG ERROR: {e}"

navigator_service = NavigatorService()
