from typing import List, Dict

class RecommendationEngine:
    @staticmethod
    def get_full_recommendation(data: Dict) -> Dict:
        symptoms = data.get("symptoms", "").lower()
        pain_level = data.get("pain_level", 0)
        conditions = data.get("existing_conditions", "").lower()
        
        diet_plan = "Standard healthy diet: Lean proteins, whole grains, and plenty of vegetables."
        meal_recommendations = ["Oatmeal with berries", "Grilled chicken salad", "Steamed fish with quinoa"]
        lifestyle_advice = "Regular light exercise, 7-8 hours of sleep."
        health_tips = ["Drink plenty of water", "Limit processed sugars"]
        
        if "fever" in symptoms or "flu" in symptoms:
            diet_plan = "High-calorie, nutrient-dense soft diet."
            meal_recommendations = ["Chicken soup", "Bananas", "Yogurt", "Herbal tea with honey"]
            lifestyle_advice = "Complete bed rest. Monitor temperature regularly."
            
        elif "stomach" in symptoms or "gastritis" in conditions:
            diet_plan = "Low-acid, non-spicy diet."
            meal_recommendations = ["Boiled rice", "Toast", "Applesauce", "Ginger tea"]
            lifestyle_advice = "Eat small, frequent meals. Avoid caffeine and spicy foods."
            
        if pain_level > 7:
            lifestyle_advice += " Extreme pain detected. Avoid strenuous activity and seek immediate medical attention."
            
        if "diabetes" in conditions:
            diet_plan = "Low-glycemic index diet."
            health_tips.append("Monitor blood sugar levels multiple times a day.")

        return {
            "personalized_diet_plan": diet_plan,
            "meal_recommendations": meal_recommendations,
            "lifestyle_advice": lifestyle_advice,
            "health_tips": health_tips
        }

