from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# Update the Goals depending on if the user is logged in or not
    
class GoalsPatch(Resource):    
    @jwt_required()
    def patch(self):
        try:
            # Get the goal ID from the URL
            goal_id = request.view_args.get('goal_id')
            goal = Goal.query.get(goal_id)

            # Check if the goal exists
            if not goal:
                return make_response({"error": "Goal not found."}, 404)

            # Check if the logged-in user is the owner of the goal
            if goal.user_id != current_user.id:
                return make_response({"error": "You can only update your own goals."}, 403)

            # Get the data to update from the request body
            data = request.get_json()

            # Update the fields of the goal
            if "goal_amount" in data:
                goal.goal_amount = data["goal_amount"]
            if "current_savings" in data:
                goal.current_savings = data["current_savings"]
            if "is_completed" in data:
                goal.is_completed = data["is_completed"]
            if "date" in data:
                goal.date = data["date"]

            # Commit the changes to the database
            db.session.commit()

            return make_response(goal.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)