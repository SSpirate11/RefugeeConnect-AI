# Mock service to use when no API key is present
class MockGeminiService:
    async def analyze_credential_image(self, image_path: str):
        return """
        {
            "extracted_text": "University of Damascus... Bachelor of Science...",
            "document_type": "Degree Certificate",
            "institution": "University of Damascus",
            "country": "Syria",
            "is_damaged": false
        }
        """

    async def map_curriculum(self, credential_text, target_standard):
        return {"equivalency": "Partial", "gap_analysis": ["Missing specialized module"]}

# Logic to switch between Real and Mock
# In real servie file, we can add a check
