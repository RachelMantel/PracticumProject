from flask import Flask, request, jsonify
from transformers import pipeline


app = Flask(__name__)

# יצירת pipeline של המודל zero-shot-classification
# הוספת פרמטר force_download=True להורדה מחדש של המודל אם הייתה בעיה בהורדה הקודמת
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", force_download=True)

# רשימה של מילים אפשריות
choices = ["happy", "sad", "excited", "angry", "relaxed",  "hopeful", "grateful"]

@app.route("/predict", methods=["POST"])
def predict():
    # קבלת הטקסט מהבקשה
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # שימוש במודל על הטקסט
    result = classifier(text, candidate_labels=choices)
    
    # חזרה עם התוצאה - מילת ההתאמה הטובה ביותר
    best_match = result["labels"][0]
    return jsonify({"best_match": best_match, "score": result["scores"][0]})


if __name__ == "__main__":
    app.run(debug=True)