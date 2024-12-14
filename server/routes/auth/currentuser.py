from routes.__init__ import Resource, request, db, make_response, jwt_required, get_jwt_identity, current_user, unset_jwt_cookies
from models.user import User



class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        try:
            return make_response(current_user.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 422)
        
    @jwt_required()
    def patch(self):
        try:
            # Get the current user
            user = current_user

            # Get the updated data from the request JSON payload
            data = request.get_json()

            if not data:
                return make_response({"error": "No data provided"}, 400)

            # Update user attributes based on the provided data
            if "name" in data:
                user.name = data["name"]
            if "email" in data:
                user.email = data["email"]
            if "password" in data:
                user.set_password(data["password"]) 

            # Save the updated user details to the database
            db.session.commit()

            return make_response({"message": "User updated successfully", "user": user.to_dict()}, 200)

        except Exception as e:
            db.session.rollback()  # Rollback changes in case of an error
            return make_response({"error": str(e)}, 500)
        
class UserDelete(Resource):
    @jwt_required() 
    def delete(self):
        try:
            # Get the identity of the currently authenticated user
            user_identity = get_jwt_identity()

            # Fetch the user from the database (example assumes a User model exists)
            user = db.session.query(User).filter_by(id=user_identity).first()

            if not user:
                return make_response({"error": "User not found"}, 404)

            # Delete the user
            db.session.delete(user)
            db.session.commit()

            # Clear cookies and logout the user
            response = make_response({"message": "User deleted successfully"}, 200)
            unset_jwt_cookies(response)  # Clear JWT cookies

            return response

        except Exception as e:
            # Catch any errors and return an appropriate response
            return make_response({"error": str(e)}, 500)
        



# Check Token that validates the token and return an empty {}