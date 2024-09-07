from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('../model/model.keras')

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the data from the request
        data = request.json
        
        # Ensure that the data is in the correct format (longitude, latitude, etc.)
        # Assuming the features are in the format: ['geo_lon', 'geo_lat', 'offense_category_id', 'victim_count']
        input_features = np.array(data['features']).reshape(1, -1)  # Adjust based on your input size
        
        # Make the prediction
        prediction = model.predict(input_features)
        
        # Convert the prediction to a class (e.g., severity level)
        predicted_severity = np.argmax(prediction, axis=1)[0]  # Assuming you're using a softmax activation
        
        # Return the prediction as a JSON response
        return jsonify({'severity': int(predicted_severity)})
    
    except Exception as e:
        return jsonify({'error': str(e)})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
