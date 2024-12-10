# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
# from os import environ
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///goalgetter.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SESSION_TYPE"] = "sqlalchemy"
app.json.compact = False

# app.secret_key = environ.get("SESSION_SECRET")


# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app, prefix="/api/v1")
flask_bcrypt = Bcrypt(app)
Session(app)
# Instantiate CORS
CORS(app)
