from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user
from datetime import datetime

class CreateGoal(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Validate that the required fields are provided
            if "goal_amount" not in data or "start_date" not in data or "end_date" not in data or "name" not in data:
                return make_response({"error": "name, goal_amount, start_date, and end_date are required."}, 400)

            # Ensure goal_amount is a positive number
            try:
                goal_amount = float(data["goal_amount"])
                if goal_amount <= 0:
                    return make_response({"error": "goal_amount must be a positive number."}, 400)
            except ValueError:
                return make_response({"error": "goal_amount must be a valid number."}, 400)

            # Convert 'start_date' and 'end_date' strings to Python date objects
            try:
                start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
                end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
            except ValueError:
                return make_response({"error": "Invalid date format. Use YYYY-MM-DD."}, 400)

            # Ensure start_date is before end_date
            if start_date > end_date:
                return make_response({"error": "start_date cannot be later than end_date."}, 400)

            # Optional: Set current_savings to 0.0 if it's not provided
            current_savings = data.get("current_savings", 0.0)

            # Create a new goal instance
            new_goal = Goal(
                name=data["name"],
                goal_amount=goal_amount,
                current_savings=current_savings,
                start_date=start_date,
                end_date=end_date,
                user_id=current_user.id  # The goal is associated with the logged-in user
            )

            # Commit the new goal to the database
            db.session.add(new_goal)
            db.session.commit()

            # Return the created goal as a response with status code 201 (Created)
            return make_response(new_goal.to_dict(), 201)

        except Exception as e:
            # General exception handling
            return make_response({"error": str(e)}, 500)
