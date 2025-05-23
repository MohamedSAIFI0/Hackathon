from flask import Flask, request, jsonify
import joblib
from sentence_transformers import SentenceTransformer
import numpy as np

# Initialize Flask application
app = Flask(__name__)

# Load the trained classification model
model = joblib.load("model.pkl")

# Load sentence transformer model for text embedding generation
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint for predicting whether code is written by AI or human.
    
    Accepts POST requests with JSON data containing 'code' field.
    Returns prediction result as 'IA' (AI) or 'Humain' (Human).
    
    Returns:
        JSON response with prediction result and label
        Error response (400) if input is invalid
    """
    data = request.get_json()
    
    # Validate input data
    if not data or "code" not in data:
        return jsonify({"error": "Please provide source code in the 'code' field"}), 400
    
    code_text = data["code"]

    # Generate embedding vector from input text
    embedding = embedding_model.encode([code_text], convert_to_numpy=True)

    # Make prediction using the loaded model
    prediction = model.predict(embedding)[0]
    result = "IA" if prediction == 1 else "Humain"

    return jsonify({
        "prediction": result,
        "label": int(prediction)
    })

if __name__ == "__main__":
    # Run the Flask application in debug mode when executed directly
    app.run(debug=True)
