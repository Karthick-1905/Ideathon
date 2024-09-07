import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE  # For handling class imbalance
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.regularizers import l2


np.random.seed(42)
tf.random.set_seed(42)


# Load dataset
df = pd.read_csv('./dataset/crime.csv', encoding='ISO-8859-1')
of_df = pd.read_csv('./dataset/offense_codes.csv')
df = df.dropna()

# Determine severity (custom logic remains the same)
def determine_severity(row):
    offense_type = row['offense_category_id']
    victim_count = row['victim_count']
    if offense_type in ['murder', 'sexual-assault']:
        return 3  # High severity
    elif offense_type in ['aggravated-assault', 'robbery', 'auto-theft']: 
        return 3 if victim_count > 3 else 2  # Medium or High severity
    elif offense_type in ['burglary', 'theft-from-motor-vehicle', 'larceny']:
        return 2 if victim_count > 2 else 1  # Low or Medium severity
    elif offense_type in ['all-other-crimes', 'drug-alcohol', 'other-crimes-against-persons']:
        return 1 if victim_count > 1 else 0  # Low or Very Low severity
    elif offense_type in ['white-collar-crime', 'public-disorder']:
        return 0  # Very Low severity
    elif offense_type == 'arson':
        return 2 if victim_count > 2 else 1  # Medium or Low severity
    else:
        return -1  # Unknown severity

df['severity'] = df.apply(determine_severity, axis=1)

# Label encoding for categorical feature 'offense_category_id'
le = LabelEncoder()
df['offense_category_id'] = le.fit_transform(df['offense_category_id'])

# Additional Feature Engineering (Extracting day of the week)
df['first_occurrence_date'] = pd.to_datetime(df['first_occurrence_date'], format="%m/%d/%Y %I:%M:%S %p", errors='coerce')
df['day_of_week'] = df['first_occurrence_date'].dt.dayofweek

# Feature set
features = ['geo_lon', 'geo_lat', 'offense_category_id', 'victim_count']
X = df[features]
y = df['severity']

# Handle class imbalance using SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Feature scaling
scaler = StandardScaler()
X_resampled = scaler.fit_transform(X_resampled)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.3, random_state=42)

# Convert labels to categorical (one-hot encoding)
y_train = tf.keras.utils.to_categorical(y_train, num_classes=4)
y_test = tf.keras.utils.to_categorical(y_test, num_classes=4)

# Build the model
model = Sequential([
    Dense(128, input_shape=(X_train.shape[1],), activation='relu', kernel_regularizer=l2(0.001)),
    Dropout(0.4),
    Dense(64, activation='relu', kernel_regularizer=l2(0.001)),
    Dropout(0.3),
    Dense(32, activation='relu', kernel_regularizer=l2(0.001)),
    Dropout(0.3),
    Dense(4, activation='softmax')  # 4 output classes (0, 1, 2, 3)
])

# Compile the model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
with tf.device('/GPU:0'):
    history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=50, batch_size=32)

# Plot the learning curves
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Learning Curve')
plt.xlabel('Epochs')
plt.ylabel('Accuracy / Loss')
plt.legend()
plt.show()

# Evaluate the model 
y_pred = model.predict(X_test)
y_pred_classes = tf.argmax(y_pred, axis=1)
y_test_classes = tf.argmax(y_test, axis=1)

# Print classification report
print(classification_report(y_test_classes, y_pred_classes))
# Save the entire model as a SavedModel
model.save('./model.keras')  # Replace 'path_to_save_model' with your desired directory
