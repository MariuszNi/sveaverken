from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# Konfiguracja klucza API
openai.api_key = ""

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Używa modelu GPT-4 Turbo
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response["choices"][0]["message"]["content"]
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
