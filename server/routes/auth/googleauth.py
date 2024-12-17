from routes.__init__ import (
    Resource,
    request,
    db,
    make_response,
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies
)
from models.user import User
from sqlalchemy.exc import IntegrityError

class GoogleAuth(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get("email")
            name = data.get("name")
            if not email or not name:
                return make_response({"error": "Invalid Google data"}, 400)
            user = User.query.filter_by(email=email.lower()).first()

            if not user:
                user = User(email=email, name=name)
                # user.password = None  # No password for Google sign-ins
                db.session.add(user)
                db.session.commit()  # Commit changes to the database

            # Create access and refresh tokens
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            # Prepare response
            response = make_response({
                "message": "Logged in with Google",
                "user": user.to_dict()
            }, 200)

            # Set cookies with the generated tokens
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

            return response

        except IntegrityError as e:
            print(f"Integrity error: {e.orig}")
            return make_response({"error": "User with this email already exists"}, 422)
        except Exception as e:
            print(f"Error: {str(e)}")
            return make_response({"error": str(e)}, 500)
