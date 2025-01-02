from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# User can Delete the goal they created from our system but only that specific user if they are logged in  
class GoalsDelete(Resource):
    @jwt_required()
    def delete(self, goal_id): 
        try:

            goal = Goal.query.get(goal_id)
            if not goal or goal.user_id != current_user.id:
                return make_response({"error": "Goal not found or you are not authorized to delete this goal."}, 403)

            db.session.delete(goal)
            db.session.commit()

            return make_response({"message": "Goal deleted successfully."}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)