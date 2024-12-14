from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# If it is the user that is logged in then allow them to see their goals no-one elses
class GoalsById(Resource):    
    @jwt_required()
    def get(self, goal_id):
        try:
            goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first()
            if not goal:
                return make_response({"message": "Goal not found or you dont have permission to access it."})
            return make_response(goal.dict(), 200)
        except ValueError as e:
            return make_response({"error": str(e)}, 422)
        except Exception as e:
            return make_response({"error": str(e)}, 500)