from flask import request, g, render_template, session
from werkzeug.exceptions import NotFound
from config import app, api, db

# From my Auth folder
from routes.auth.login import Login
from routes.auth.signup import Signup
from routes.auth.logout import Logout
from routes.auth.currentuser import CurrentUser
from routes.auth.refresh import Refresh

# Only From My Routes Goal folder
from routes.goal.goals import GoalsGet
from routes.goal.goalsbyid import GoalsById
from routes.goal.goalsdelete import GoalsDelete
from routes.goal.goalspatch import GoalsPatch
# Add your model imports


# Views go here!

@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(CurrentUser, "/current-user")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")

api.add_resource(GoalsGet, "/user/goals")  # This is for getting all goals
api.add_resource(GoalsById, "/user/goals/<int:goal_id>")  # This is for getting, updating, or deleting a specific goal by ID
api.add_resource(GoalsPatch, "/user/goals/<int:goal_id>/update")  # This is for updating a goal
api.add_resource(GoalsDelete, "/user/goals/<int:goal_id>/delete")  # This is for deleting a goal


if __name__ == '__main__':
    app.run(port=5555, debug=True)