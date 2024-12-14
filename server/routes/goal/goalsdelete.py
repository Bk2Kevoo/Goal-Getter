from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# User can Delete the goal they created from our system but only that specific user if they are logged in 
class GoalsDelete(Resource):
    @jwt_required()
    def delete(self):
        try:
            # Get the goal ID from the request body
            goal_id = request.json.get('goal_id')

            # Get the goal using the primary key (id)
            goal = Goal.query.get(goal_id)

            # Check if the goal exists and belongs to the logged-in user
            if not goal or goal.user_id != current_user.id:
                return make_response({"error": "Goal not found or you are not authorized to delete this goal."}, 403)

            # Delete the goal
            db.session.delete(goal)
            db.session.commit()

             # Return a success message with the goal ID
            return make_response({"message": "Goal deleted successfully."}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)