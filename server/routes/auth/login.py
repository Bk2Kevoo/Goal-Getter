from routes.__init__ import (
    Resource,
    request,
    db,
    make_response,
    session,
    jwt_required,
    get_jwt_identity,
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    unset_access_cookies,
    unset_refresh_cookies,
    unset_jwt_cookies,
    current_user,
    get_jwt
)
from models.user import User

class Login(Resource):
    def post(self):
        try:
            #! 1. Get the data through the request context
            data = request.json
            #! Check that you can find a user by that email AND that the password matches
            user = User.query.filter_by(email=data.get("email", "")).first()
            if user and user.authenticate(data.get("password", "")):
                access_token = create_access_token(identity=user.id)
                refresh_token = create_refresh_token(identity=user.id)
                response = make_response(user.to_dict(), 200)
                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)
                return response
            else:
                return make_response({"error": "Invalid Credentials"}, 401)
        except Exception as e:
            return make_response({"error": str(e)}, 400)