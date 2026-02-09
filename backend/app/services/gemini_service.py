import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not set. Using Mock Service.")
            self.vision_model = None
        else:
            genai.configure(api_key=api_key)
            self.vision_model = genai.GenerativeModel('gemini-flash-latest')
            self.reasoning_model = genai.GenerativeModel('gemini-flash-latest')

    async def analyze_credential_image(self, image_path: str):
        if not self.vision_model:
            from app.services.mock_gemini import MockGeminiService
            mock = MockGeminiService()
            # Wrap in json parse to match real service return type (string of json) if mock returns string
            # But mock returns string already.
            return await mock.analyze_credential_image(image_path)

        if not os.path.exists(image_path):
            return {"error": "File not found"}
            
        try:
            # Upload file to Gemini (for larger files) or pass inline data
            myfile = genai.upload_file(image_path)
            
            prompt = """
            Analyze this credential document. 
            1. Extract all legible text.
            2. Identify the document type (Degree, Transcript, Certificate, etc.).
            3. Identify the issuing institution and country.
            4. If the document is damaged or unclear, note the damaged areas.
            
            Return the response as a valid JSON object with keys: 
            extracted_text, document_type, institution, country, is_damaged (boolean).
            """
            
            result = await self.vision_model.generate_content_async([myfile, prompt])
            
            # Simple cleanup of json Markdown
            response_text = result.text.replace("```json", "").replace("```", "").strip()
            print(f"DEBUG: Gemini Analysis Result: {response_text}")
            return response_text
            
        except Exception as e:
            print(f"Gemini Error: {e}")
            import json
            return json.dumps({"error": str(e)})

    async def map_curriculum(self, credential_details: dict, target_country: str = "Germany"):
        if not self.reasoning_model:
            # Mock behavior
            return {
                "equivalency_score": 0.85,
                "target_degree": "Approbration (Medical License)",
                "missing_modules": ["Medical Law in Germany", "Clinical Terminology C1"],
                "recommendations": ["Take a 3-month integration course", "Pass the FSP exam"]
            }

        try:
            prompt = f"""
            Act as an expert academic evaluator. Compare the following credential details against the standard requirements for practicing in {target_country}.
            
            Credential Details:
            {credential_details}
            
            Task:
            1. Determine the likely equivalent degree/certification in {target_country}.
            2. Estimate an equivalency score (0.0 to 1.0).
            3. Identify specific gaps (missing modules, regulatory requirements).
            4. Provide actionable recommendations to bridge these gaps.
            
            Return JSON:
            {{
                "equivalency_score": float,
                "target_degree": string,
                "missing_modules": [string],
                "recommendations": [string]
            }}
            """
            
            result = await self.reasoning_model.generate_content_async(prompt)
             # Simple cleanup
            response_text = result.text.replace("```json", "").replace("```", "").strip()
            return response_text

        except Exception as e:
            print(f"Gemini Reasoning Error: {e}")
            return {"error": str(e)}

    async def translate_image(self, image_path: str, target_language: str = "English"):
        """
        Camera Translation: Extract text from image and translate to target language
        Uses Gemini Vision for OCR + Translation in one multimodal call
        """
        if not self.vision_model:
            # Mock response
            return {
                "original_text": "مرحبا بك في ألمانيا",
                "translated_text": "Welcome to Germany",
                "target_language": target_language,
                "confidence": 0.95
            }
        
        if not os.path.exists(image_path):
            return {"error": "File not found"}
        
        try:
            myfile = genai.upload_file(image_path)
            
            prompt = f"""
            You are a professional translator and OCR expert.
            
            Task:
            1. Extract ALL visible text from this image (signs, documents, labels, etc.)
            2. Detect the source language
            3. Translate the extracted text to {target_language}
            4. Provide contextual explanation if needed (e.g., "This is a subway sign directing to...")
            
            Return a JSON object with:
            {{
                "original_text": "extracted text in original language",
                "detected_language": "detected language name",
                "translated_text": "translation in {target_language}",
                "contextual_explanation": "brief context about what this text is",
                "confidence": float (0.0 to 1.0)
            }}
            
            Be accurate and contextual. If text is unclear, mention it in the explanation.
            """
            
            result = self.vision_model.generate_content([myfile, prompt])
            response_text = result.text.replace("```json", "").replace("```", "").strip()
            
            # Parse to ensure it's valid JSON
            import json
            parsed = json.loads(response_text)
            
            return {
                "original_text": parsed.get("original_text", ""),
                "translated_text": parsed.get("translated_text", ""),
                "target_language": target_language,
                "detected_language": parsed.get("detected_language", "Unknown"),
                "contextual_explanation": parsed.get("contextual_explanation", ""),
                "confidence": parsed.get("confidence", 0.9)
            }
            
        except Exception as e:
            print(f"Gemini Translation Error: {e}")
            return {"error": str(e)}
    
    async def translate_text(self, text: str, source_language: str, target_language: str):
        """
        Text-only translation (no image)
        """
        if not self.reasoning_model:
            return f"[Translated from {source_language} to {target_language}]: {text}"
        
        try:
            prompt = f"""
            Translate the following text from {source_language} to {target_language}.
            Provide a natural, contextual translation.
            
            Text: {text}
            
            Return only the translated text, nothing else.
            """
            
            result = self.reasoning_model.generate_content(prompt)
            return result.text.strip()
            
        except Exception as e:
            print(f"Translation Error: {e}")
            return {"error": str(e)}

gemini_service = GeminiService()
