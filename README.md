# 🎓 AI Student Intelligence Dashboard

An AI-powered web application that analyzes student performance, identifies at-risk students, and generates personalized recommendations using machine learning.

---

## 🚀 Project Overview

The **AI Student Intelligence Dashboard** is designed to help educators monitor student performance and take data-driven decisions. It acts as an **early warning system** by predicting student risk levels and providing actionable insights.

This system combines **machine learning + rule-based logic** to deliver intelligent analysis and recommendations.

---

## 🎯 Features

### 📊 Performance Analysis

* Analyze student data (marks, attendance, study hours, assignments)
* Calculate average score
* Generate risk score (0–100)

### ⚠️ Risk Prediction

* Classifies students into:

  * ✅ Low Risk
  * ⚠️ Medium Risk
  * 🚨 High Risk
* Uses **Random Forest Classifier**

### 🧠 AI Insights

* Identifies key factors affecting performance
* Explains WHY a student is at risk

### 💡 Personalized Task Plan

* Generates actionable recommendations:

  * Improve attendance
  * Increase study hours
  * Focus on weak subjects

### 📈 Dashboard UI

* Modern dashboard interface
* KPI cards (Average, Risk Score, Risk Level)
* Progress indicators
* Student data table

---

## 🧰 Tech Stack

* **Backend:** Python (Flask)
* **Machine Learning:** Scikit-learn (Random Forest)
* **Frontend:** HTML, CSS, JavaScript
* **Data Handling:** Pandas

---

## 📁 Project Structure

```
student_dashboard/
│
├── app.py
├── data.csv
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/student-dashboard.git
cd student-dashboard
```

### 2. Install dependencies

```
pip install flask pandas scikit-learn
```

### 3. Run the application

```
python app.py
```

### 4. Open in browser

```
http://127.0.0.1:5000
```

---

## 🧪 Sample Input

* Math: 45
* Science: 50
* English: 60
* Attendance: 65%
* Study Hours: 2
* Assignments: 4

---

## 📊 Sample Output

* Risk Level: 🚨 High Risk
* Risk Score: 75

### 🔍 Insights:

* Low academic performance
* Poor attendance
* Low study hours

### 💡 Recommendations:

* Increase study time
* Improve attendance
* Complete assignments

---

## 🧠 Concepts Covered

* Relevant Information in Learning Systems
* Statistical Learning Methods
* Knowledge in Learning

---

## 🌍 SDG Alignment

This project supports:

**Quality Education (SDG 4)**
by enabling personalized learning and early intervention.

---

## 🚀 Future Improvements

* Real-time data integration
* Advanced ML models (XGBoost, Neural Networks)
* Student performance tracking
* Mobile app development
* Personalized learning paths

---

## 👨‍💻 Author

**Your Name**

---

## ⭐ Acknowledgement

This project demonstrates the application of AI in education to improve learning outcomes and support data-driven decision-making.
