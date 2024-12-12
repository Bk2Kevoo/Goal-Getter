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
    get_jwt,
)
from models.user import User
from sqlalchemy.exc import IntegrityError

class Login(Resource):
    @jwt_required
    def post(self):
        try:
            data = request.json
            user = User(email=data.get("email"), name=data.get("name"))
            user.password = data.get("password")
            db.session.add(user)
            db.session.commit()
            # import ipdb; ipdb.set_trace()
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            response = make_response(user.to_dict(), 201)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        except IntegrityError as e:
            return make_response({"error": str(e.orig)}, 422)
        except Exception as e:
            return make_response({"error": str(e)}, 422)