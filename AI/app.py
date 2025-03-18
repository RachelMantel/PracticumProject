from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # מאפשר לשלוח בקשות מה-Frontend

# יצירת pipeline של המודל zero-shot-classification
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# רשימה של קטגוריות מצב רוח אפשריות
choices = ["happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful","nervous"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # קבלת הנתונים מהבקשה
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # שימוש במודל על הטקסט
        result = classifier(text, candidate_labels=choices)

        # החזרת המצב רוח הכי מתאים
        best_match = result["labels"][0]
        best_score = float(result["scores"][0])  # המרת הציון ל-float

        return jsonify({"moodCategory": best_match, "confidence": best_score})

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
