from werkzeug.exceptions import NotFound
from flask import render_template
from config import app, api
# Add your model imports


# Views go here!
@app.errorhandler(NotFound)
def not_found(error):
    return{"error": error.description}, 404


if __name__ == '__main__':
    app.run(port=5555, debug=True)

