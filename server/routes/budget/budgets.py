from routes.__init__ import make_response, Resource, session



# We have to create full CRUD on all the routes
class Budgets(Resource):
    def get(self):
        try:
            user.id = session.get("user_id")
        except Exception as e:
            return make_response({"error": str(e)}, 500)