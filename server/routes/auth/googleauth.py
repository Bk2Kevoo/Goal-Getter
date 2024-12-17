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
            email = email.lower()
            user = User.query.filter_by(email=email).first()

            if not user:
                user = User(email=email, name=name)
                db.session.add(user)
                db.session.commit() 
                print(f"New user created: {user.name} ({user.email})")
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            # Prepare response with user data (ensure not returning sensitive data like password)
            response_data = {
                "message": "Logged in with Google",
                "user": user.to_dict() 
            }
            response = make_response(response_data, 200)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        except IntegrityError as e:
            db.session.rollback() 
            print(f"Integrity error: {e.orig}")
            return make_response({"error": "Error with user creation, please try again."}, 422)
        except Exception as e:
            db.session.rollback() 
            print(f"Unexpected error: {str(e)}")
            return make_response({"error": "An unexpected error occurred"}, 500)
