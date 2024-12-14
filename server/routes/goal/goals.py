from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required
from models.goal import Goal
from flask_jwt_extended import current_user

class GoalsGet(Resource):
    @jwt_required()
    def get(self):
        try:
            # Fetch goals for the logged-in user
            goals = Goal.query.filter(Goal.user_id == current_user.id).all()

            # If no goals are found, return a message
            if not goals:
                return make_response({"message": "No goals found."}, 404)
            
            # If the goal was found then succesfully get their SPECIFIC goal
            return make_response([goal.to_dict() for goal in goals], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
