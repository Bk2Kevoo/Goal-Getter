from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# If it is the user that is logged in, then allow them to see their goals, no one else's
class GoalsById(Resource):    
    @jwt_required()
    def get(self, goal_id):
        try:
            goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first()
            if not goal:
                return make_response({"message": "Goal not found or you don't have permission to access it."})

            # Use the to_dict method to convert the Goal to a dictionary
            goal_data = goal.to_dict()

            return make_response(goal_data, 200)
        except ValueError as e:
            return make_response({"error": str(e)}, 422)
        except Exception as e:
            return make_response({"error": str(e)}, 500)