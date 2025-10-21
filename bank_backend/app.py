from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# --- Database Connection ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Keerthi@08",
    database="bank"
)
cursor = db.cursor(dictionary=True)

# ----------------------------
# CUSTOMER ROUTES
# ----------------------------
@app.route("/customers", methods=["GET"])
def get_customers():
    cursor.execute("SELECT * FROM Customer")
    return jsonify(cursor.fetchall())

@app.route("/customers", methods=["POST"])
def add_customer():
    data = request.json
    cursor.execute(
        "INSERT INTO Customer (Name, age, gender, Phone, Address) VALUES (%s,%s,%s,%s,%s)",
        (data["Name"], data["age"], data["gender"], data["Phone"], data["Address"])
    )
    db.commit()
    return jsonify({"message": "Customer added!"})

@app.route("/customers/<int:id>", methods=["PUT"])
def update_customer(id):
    data = request.json
    cursor.execute("""
        UPDATE Customer 
        SET Name=%s, age=%s, gender=%s, Phone=%s, Address=%s 
        WHERE CustomerID=%s
    """, (data["Name"], data["age"], data["gender"], data["Phone"], data["Address"], id))
    db.commit()
    return jsonify({"message": "Customer updated!"})

@app.route("/customers/<int:id>", methods=["DELETE"])
def delete_customer(id):
    cursor.execute("DELETE FROM Customer WHERE CustomerID=%s", (id,))
    db.commit()
    return jsonify({"message": "Customer deleted!"})

# ----------------------------
# ACCOUNT ROUTES
# ----------------------------
@app.route("/accounts", methods=["GET"])
def get_accounts():
    cursor.execute("""
        SELECT a.*, c.Name AS CustomerName 
        FROM Account a 
        JOIN Customer c ON a.CustomerID = c.CustomerID
    """)
    return jsonify(cursor.fetchall())

# ----------------------------
# TRANSACTION ROUTES
# ----------------------------
@app.route("/transactions", methods=["GET"])
def get_transactions():
    cursor.execute("""
        SELECT t.*, a.Type AS AccountType 
        FROM Transaction t 
        JOIN Account a ON t.AccountID = a.AccountID
    """)
    return jsonify(cursor.fetchall())

# ----------------------------
# LOAN ROUTES
# ----------------------------
@app.route("/loans", methods=["GET"])
def get_loans():
    cursor.execute("""
        SELECT l.*, c.Name AS CustomerName 
        FROM Loan l 
        JOIN Customer c ON l.CustomerID = c.CustomerID
    """)
    return jsonify(cursor.fetchall())

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

if __name__ == "__main__":
    app.run(debug=True)
