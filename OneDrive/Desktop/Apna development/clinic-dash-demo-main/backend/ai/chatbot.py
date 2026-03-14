import os
from typing import List, Dict

class AIChatbot:
    def __init__(self):
        # In a real app, initialize OpenAI or a local LLM client here
        self.api_key = os.getenv("AI_API_KEY", "mock-key")

    async def get_response(self, user_id: int, message: str, history: List[Dict] = []) -> str:
        lower_msg = message.lower()
        disclaimer = "\n\n**Disclaimer**: I am an AI assistant, not a doctor. This information is for educational purposes. Please consult a healthcare professional for diagnosis and treatment."
        
        # Enhanced Mock Logic based on seeded data
        if any(word in lower_msg for word in ["fever", "chills", "aches", "flu"]):
            response = "Based on your symptoms, it could be **Influenza (Flu)** or a **Common Cold**. \n\n**Commonly used medicines**: Paracetamol for fever, Oseltamivir for Flu (prescription required). \n\n**Advice**: Stay hydrated and rest."
        elif any(word in lower_msg for word in ["stomach", "gastric", "burn", "nausea"]):
            response = "Your symptoms suggest possible **Gastritis** or **Acid Reflux**. \n\n**Commonly used medicines**: Antacids or Omeprazole. \n\n**Advice**: Avoid spicy foods and lying down immediately after eating."
        elif any(word in lower_msg for word in ["headache", "migraine", "throbbing"]):
            response = "You might be experiencing a **Migraine** or a tension headache. \n\n**Commonly used medicines**: Sumatriptan or Ibuprofen. \n\n**Advice**: Rest in a dark, quiet room."
        elif any(word in lower_msg for word in ["sugar", "diabetes", "thirst", "urinate"]):
            response = "Increased thirst and urination can be signs of **Type 2 Diabetes**. \n\n**Commonly used medicines**: Metformin (prescription required). \n\n**Advice**: Monitor your blood sugar and consult an endocrinologist."
        elif any(word in lower_msg for word in ["blood pressure", "hypertension", "bp"]):
            response = "If you have high blood pressure, you may have **Hypertension**. \n\n**Commonly used medicines**: Amlodipine or Lisinopril. \n\n**Advice**: Reduce salt intake and exercise regularly."
        else:
            response = "I've noted your symptoms: '" + message + "'. While I can't provide a definitive diagnosis, these could be related to various common conditions. Would you like to try searching our **Medical Knowledge Base** for specific symptoms?"
            
        return response + disclaimer

# Global instance
chatbot = AIChatbot()
