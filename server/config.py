from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_migrate import Migrate
from flask_restful import Api
from flask_bcrypt import Bcrypt
from os import environ

# Create an instance of the Flask application instance
app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///coreflow.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SESSION_TYPE"] = "sqlalchemy"

app.secret_key = environ.get("SESSION_SECRET")

# flask-sqlalchemy connection to app
db = SQLAlchemy(app)
app.config["SESSION_SQLALCHEMY"] = db

# flask-migrate connection to app
migrate = Migrate(app, db)

# flask-restful connection to app
api = Api(app, prefix="/api/v1")
flask_bcrypt = Bcrypt(app)
Session(app)