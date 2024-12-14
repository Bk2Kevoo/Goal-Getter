from models.__init__ import SerializerMixin, validates, db
from models.budget import Budget 
# from datetime import datetime

class Expense(db.Model, SerializerMixin):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"))
    created_at = db.Column(db.DateTime,  server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())


    def __repr__(self):
        return f"""
            <Expense #{self.id}:
                Description: {self.description}
                Amount: {self.amount}
                Date: {self.date}
                Budget Id: {self.budget_id}>
        """
    
    # Relationships
    budget = db.relationship("Budget", back_populates="expenses")

    # Serialize
    serialize_rules = ("-budget",)

    @validates("description")
    def validate_description(self, key, description):
        if len(description) < 3:  # Check if the description length is less than 3
            raise ValueError("Description must be at least 3 characters long.")
        return description
    
    @validates("amount")
    def validate_amount(self, key, amount):
        if not isinstance(amount, float):
            raise TypeError("Amount must be of type float")
        elif amount < 0:
            raise ValueError("Amount must be greater than 0")
        return amount
        
    @validates("date")
    def validate_date(self, key, value):
        if not value:
            raise ValueError("A valid date must be provided.")
        return value
    
    # @validates("budget_id")
    # def validate_budget_id(self, _, budget_id):
    #     if not isinstance(budget_id, int):
    #         raise TypeError("Budget ids must be integers")
    #     elif budget_id < 1:
    #         raise ValueError(f"{budget_id} must be a positive integer")
    #     elif not db.session.query(Budget).get(budget_id):
    #         raise ValueError(f"{budget_id} must belong to an existing Budget")
    #     return budget_id