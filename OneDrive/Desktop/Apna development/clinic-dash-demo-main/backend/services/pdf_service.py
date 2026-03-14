from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

class PDFService:
    @staticmethod
    def generate_report_pdf(report_data: dict, output_path: str):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        c = canvas.Canvas(output_path, pagesize=letter)
        width, height = letter
        
        c.setFont("Helvetica-Bold", 16)
        c.drawString(100, height - 100, "Medical Report")
        
        c.setFont("Helvetica", 12)
        c.drawString(100, height - 130, f"Patient: {report_data.get('patient_name', 'N/A')}")
        c.drawString(100, height - 150, f"Date: {report_data.get('date', 'N/A')}")
        
        y_pos = height - 180
        fields = [
            ("Symptoms", report_data.get('symptoms')),
            ("Duration", report_data.get('duration')),
            ("Pain Level", f"{report_data.get('pain_level')}/10"),
            ("Existing Conditions", report_data.get('existing_conditions')),
            ("Medications", report_data.get('medications')),
            ("Lifestyle Data", report_data.get('lifestyle_data')),
        ]
        
        for label, value in fields:
            c.setFont("Helvetica-Bold", 10)
            c.drawString(100, y_pos, f"{label}:")
            c.setFont("Helvetica", 10)
            c.drawString(220, y_pos, str(value) if value else "None")
            y_pos -= 20
           
        c.save()
        return output_path
