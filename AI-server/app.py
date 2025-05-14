from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai
from flask import Flask, request, jsonify

load_dotenv()

app = Flask(__name__)
CORS(app)  

my_api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = my_api_key

choices = ["natural","happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]
default_mood = "natural" 

my_model = "gpt-4o-mini"

def generate_mood(user_prompt):
    completion = openai.ChatCompletion.create(
        model=my_model,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": f"Please classify the following text into one of these mood categories: {', '.join(choices)}. Text: '{user_prompt}'. Please respond only with one of these mood categories."
            }
        ],
    )
    
    result = completion.choices[0].message['content'].strip().lower()

    print(f"Model response: {result}")

    if result not in [mood.lower() for mood in choices]:
        result = default_mood
    
    return {"moodCategory": result}

@app.route('/predict', methods=['POST'])
def predict():
    user_prompt = request.json.get('text')
    
    if user_prompt:
        response = generate_mood(user_prompt)
        return jsonify(response)
    else:
        return jsonify({'error': 'No text provided'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)




