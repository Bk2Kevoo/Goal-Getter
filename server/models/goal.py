from models.__init__ import SerializerMixin, validates, db
from models.user import User


class Goal(db.Model, SerializerMixin):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    goal_amount = db.Column(db.Float, nullable=False)
    current_savings = db.Column(db.Float, default=0.0, nullable=False)
    is_completed = db.Column(db.Boolean, default=False) 
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def __repr__(self):
        return f"""
            <Goal #{self.id}:
                Goal_Amount: {self.goal_amount}
                Current Savings: {self.current_savings}
                Is Completed: {self.is_completed}
                Date: {self.date}
                User Id: {self.user_id}
        """

    # Relationships
    user = db.relationship("User", back_populates="goals") 

    # Serialize
    serialize_rules = ("-user",)

    
    @validates("goal_amount")
    def validate_goal_amount(self, key, value):
        if value <= 0:
            raise ValueError("Goal amount must be greater than zero.")
        return value

    @validates("current_savings")
    def validate_current_savings(self, key, value):
        if value < 0:
            raise ValueError("Current savings cannot be negative.")
        elif hasattr(self, "goal_amount") and value > self.goal_amount:
            raise ValueError("Current savings cannot exceed the goal amount.")
        return value
    
    @validates("date")
    def validate_date(self, key, value):
        if not value:
            raise ValueError("A valid date must be provided.")
        return value

    @validates("user_id")
    def validate_user_id(self, _, user_id):
        if not isinstance(user_id, int):
            raise TypeError("Category ids must be integers")
        elif user_id < 1:
            raise ValueError(
                f"{user_id} has to be a positive integer"
            )
        elif not db.session.get(User, user_id):
            raise ValueError(f"{user_id} must belong to an existing User")
        return user_id