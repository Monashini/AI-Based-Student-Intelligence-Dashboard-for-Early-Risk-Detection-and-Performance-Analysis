from flask import Flask, render_template, request
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

# Load data
data = pd.read_csv("data.csv")

# Feature engineering
data["Average"] = (data["Math"] + data["Science"] + data["English"]) / 3

def calculate_risk(row):
    risk = 0
    if row["Average"] < 50: risk += 40
    elif row["Average"] < 70: risk += 20
    if row["Attendance"] < 75: risk += 30
    if row["StudyHours"] < 2: risk += 15
    if row["Assignments"] < 5: risk += 15
    return min(risk, 100)

data["RiskScore"] = data.apply(calculate_risk, axis=1)

def risk_label(score):
    if score > 70: return 2
    elif score > 40: return 1
    else: return 0

data["RiskLevel"] = data["RiskScore"].apply(risk_label)

# Model
features = ["Math","Science","English","Attendance","StudyHours","Assignments","Average"]
X = data[features]
y = data["RiskLevel"]

model = RandomForestClassifier()
model.fit(X, y)

@app.route("/", methods=["GET", "POST"])
def index():
    result = None

    if request.method == "POST":
        math = int(request.form["math"])
        science = int(request.form["science"])
        english = int(request.form["english"])
        attendance = int(request.form["attendance"])
        study_hours = int(request.form["study_hours"])
        assignments = int(request.form["assignments"])

        avg = (math + science + english) / 3

        input_data = [[math, science, english, attendance, study_hours, assignments, avg]]
        prediction = model.predict(input_data)[0]

        risk_score = calculate_risk({
            "Average": avg,
            "Attendance": attendance,
            "StudyHours": study_hours,
            "Assignments": assignments
        })

        if prediction == 2:
            risk_level = "HIGH 🚨"
        elif prediction == 1:
            risk_level = "MEDIUM ⚠"
        else:
            risk_level = "LOW ✅"

        result = {
            "avg": round(avg, 2),
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)