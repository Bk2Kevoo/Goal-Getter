from routes.__init__ import Resource, request, db, make_response, jwt_required, current_user
# from models.user import User


class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        try:
            return make_response(current_user.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 422)