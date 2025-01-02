from flask_restful import Api, Resource
from routes.__init__ import make_response, jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user
from datetime import date

class GoalsPatch(Resource):
    @jwt_required()
    def patch(self, goal_id):  
        try:
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
                if data["goal_amount"] <= 0:
                    return make_response({"error": "Goal amount must be positive."}, 400)
                goal.goal_amount = data["goal_amount"]
            if "current_savings" in data:
                if data["current_savings"] < 0:
                    return make_response({"error": "Current savings cannot be negative."}, 400)
                goal.current_savings = data["current_savings"]
            if "is_completed" in data:
                if not isinstance(data["is_completed"], bool):
                    return make_response({"error": "is_completed must be a boolean."}, 400)
                goal.is_completed = data["is_completed"]
            if "start_date" in data:
                try:
                    # Parse the start_date to a date object
                    goal.start_date = date.fromisoformat(data["start_date"])  # Ensure format is 'YYYY-MM-DD'
                except ValueError:
                    return make_response({"error": "Start date must be a valid date."}, 400)
            if "end_date" in data:
                try:
                    goal.end_date = date.fromisoformat(data["end_date"])  # Ensure format is 'YYYY-MM-DD'
                except ValueError:
                    return make_response({"error": "End date must be a valid date."}, 400)

            # Commit the changes to the database
            db.session.commit()

            return make_response(goal.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
