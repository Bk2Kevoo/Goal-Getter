from faker import Faker
from config import app
from models.__init__ import db
from models.budget import Budget
from models.user import User
from models.goal import Goal
from models.category import Category
from models.expense import Expense
from datetime import date

def seed_data():
    # Ensure that the current date is never in the past
    current_date = date.today()

    # Seed Users
    user1 = User(username="john_doe", email="john@example.com", _password_hash="password123")
    user2 = User(username="jane_smith", email="jane@example.com", _password_hash="password456")
    
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()  # Commit to generate user ids

    # Now that the users are committed and have IDs, you can reference their ids

    # Seed Budgets with validation for start_date and end_date
    try:
        budget1 = Budget(
            name="January Budget",
            description="Monthly budget for January",
            total_amount=1500.00,
            start_date=max(date(2024, 12, 1), current_date),  # Ensure the start_date is not in the past
            end_date=date(2025, 1, 31),
            is_active=True,
            user_id=user1.id  # Now user1.id is available
        )
        budget2 = Budget(
            name="February Budget",
            description="Monthly budget for February",
            total_amount=1800.00,
            start_date=max(date(2024, 2, 1), current_date),  # Ensure the start_date is not in the past
            end_date=date(2024, 2, 29),
            is_active=True,
            user_id=user2.id  # Now user2.id is available
        )

        db.session.add(budget1)
        db.session.add(budget2)
    except ValueError as e:
        print(f"Error: {e}")
        return

    # Seed Expenses with validation for the date
    try:
        expense1 = Expense(
            description="Groceries",
            amount=200.50,
            date=max(date(2024, 1, 5), current_date),  # Ensure the expense date is not in the past
            budget_id=budget1.id
        )

        expense2 = Expense(
            description="Dining Out",
            amount=50.75,
            date=max(date(2024, 1, 10), current_date),  # Ensure the expense date is not in the past
            budget_id=budget1.id
        )

        db.session.add(expense1)
        db.session.add(expense2)
    except ValueError as e:
        print(f"Error: {e}")
        return

    # Seed Goals with validation for the date
    try:
        goal1 = Goal(
            goal_amount=1000.00,
            current_savings=250.00,
            is_completed=False,
            date=max(date(2024, 12, 31), current_date),  # Ensure the goal date is not in the past
            user_id=user1.id  # Now user1.id is available
        )
        
        goal2 = Goal(
            goal_amount=500.00,
            current_savings=100.00,
            is_completed=False,
            date=max(date(2024, 12, 31), current_date),  # Ensure the goal date is not in the past
            user_id=user2.id  # Now user2.id is available
        )

        db.session.add(goal1)
        db.session.add(goal2)
    except ValueError as e:
        print(f"Error: {e}")
        return

    # Commit all data to the database
    db.session.commit()
    print("Seed data successfully inserted!")

# Ensure the app context is set up before seeding data
with app.app_context():
    seed_data()
