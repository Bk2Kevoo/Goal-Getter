#!/usr/bin/env python3

# Remote library imports
from faker import Faker
from werkzeug.security import generate_password_hash
from random import randint, uniform, choice
# Local imports
from app import app
from datetime import datetime, timedelta
from faker import Faker
from config import db
from models.user import User
from models.category import Category
from models.budget import Budget
from models.expense import Expense
from models.goal import Goal

fake = Faker()

# A list of predefined realistic categories
categories = [
    "Groceries", "Transport", "Utilities", "Entertainment", "Healthcare",
    "Education", "Savings", "Dining Out", "Shopping", "Miscellaneous"
]

# A list of predefined expenses linked to categories
expenses_data = {
    "Groceries": ["Supermarket shopping", "Farmers market", "Online grocery delivery"],
    "Transport": ["Gas", "Public transit", "Car maintenance"],
    "Utilities": ["Electricity bill", "Water bill", "Internet"],
    "Entertainment": ["Movies", "Concert tickets", "Streaming services"],
    "Healthcare": ["Doctor visit", "Prescriptions", "Dental check-up"],
    "Education": ["Books", "Tuition fees", "Online courses"],
    "Savings": ["Emergency fund", "Retirement savings", "Investments"],
    "Dining Out": ["Restaurant dinner", "Fast food", "Coffee shop"],
    "Shopping": ["Clothes", "Electronics", "Home decor"],
    "Miscellaneous": ["Gifts", "Charity", "Other"]
}

budget_names = [
    "Monthly Essentials", "Travel Fund", "Emergency Savings", "Vacation Fund", 
    "Home Renovation", "Wedding Savings", "Education Fund", "Holiday Spending", 
    "Retirement Savings", "Healthcare Expenses", "Rainy Day Fund", "Car Repairs Fund",
    "Summer Road Trip", "Family Reunion", "Birthday Party", "Baby Shower",
    "Graduation Trip", "New Year Celebration", "Debt Payoff Plan", "College Tuition",
    "First Home Purchase", "Business Investment", "Mortgage Fund", "Investment Fund",
    "Fitness Expenses", "Self-Care Fund", "Hobby Savings", "Dining Out Budget",
    "Tech Gadgets Fund", "Fashion Fund", "The 'Do It Later' Fund", "Adventure Savings",
    "Big Ticket Items", "The 'Treat Yourself' Fund", "Life's Little Luxuries", "The 'Just Because' Fund"
]

budget_descriptions = {
    "Monthly Essentials": "The basics you'll need to cover every month like groceries and utilities.",
    "Travel Fund": "Set aside money for your next adventure and travel expenses.",
    "Emergency Savings": "A fund for unexpected expenses that may arise in the future.",
    "Vacation Fund": "Start saving for your dream vacation, flights, and hotel stays.",
    "Home Renovation": "Money set aside to improve or update your living space.",
    "Wedding Savings": "Put aside funds for the big day and everything that comes with it.",
    "Education Fund": "Save for tuition fees, courses, and other education-related expenses.",
    "Holiday Spending": "Budget for the holiday season, including gifts, meals, and decorations.",
    "Retirement Savings": "Prepare for the future with funds allocated to your retirement.",
    "Healthcare Expenses": "Money to cover any health-related expenses, including insurance and medical bills.",
    "Rainy Day Fund": "A savings fund for those unexpected rainy days.",
    "Car Repairs Fund": "Set aside money for vehicle maintenance and unforeseen repairs.",
    "Summer Road Trip": "Funds for your next summer adventure, including gas, lodging, and activities.",
    "Family Reunion": "Save for a special family get-together, including travel and accommodation costs.",
    "Birthday Party": "Money set aside for planning and hosting a memorable birthday event.",
    "Baby Shower": "Budget for gifts, decorations, and other baby-related event expenses.",
    "Graduation Trip": "Save up for a trip to celebrate your big academic achievement.",
    "New Year Celebration": "Budget for your celebrations, parties, and festivities to ring in the new year.",
    "Debt Payoff Plan": "Focus on paying down debt and managing your finances effectively.",
    "College Tuition": "Save for your college tuition and related academic expenses.",
    "First Home Purchase": "Start saving for your first home deposit and mortgage.",
    "Business Investment": "Funds for investing in a new business or expanding your current venture.",
    "Mortgage Fund": "Set aside money to cover your monthly mortgage payments and related costs.",
    "Investment Fund": "Money set aside for long-term investments in stocks, bonds, or real estate.",
    "Fitness Expenses": "Save for your gym memberships, workout gear, and health-related activities.",
    "Self-Care Fund": "A fund dedicated to maintaining your well-being, including spa treatments and relaxation.",
    "Hobby Savings": "Save money for any hobbies or interests you enjoy, like painting or photography.",
    "Dining Out Budget": "Set aside money for meals at restaurants, cafes, or takeout.",
    "Tech Gadgets Fund": "Budget for your next tech upgrade, whether it's a phone, laptop, or gaming system.",
    "Fashion Fund": "Money for new clothes, shoes, and accessories to keep your wardrobe fresh.",
    "The 'Do It Later' Fund": "A fun savings goal for things you might not prioritize right now, but want to save for eventually.",
    "Adventure Savings": "Money saved specifically for outdoor adventures, from hiking to rock climbing.",
    "Big Ticket Items": "Funds set aside for larger purchases like furniture, electronics, or luxury items.",
    "The 'Treat Yourself' Fund": "Save for those little indulgences that make life sweet.",
    "Life's Little Luxuries": "For spending on small joys—like a nice dinner or a weekend getaway.",
    "The 'Just Because' Fund": "A fund for anything that pops up that doesn't quite fit anywhere else."
}

goal_names = [
    "Vacation Fund", "Emergency Fund", "Home Renovation", "Wedding Savings", 
    "Education Fund", "Retirement Savings", "Holiday Fund", "Car Repairs", 
    "Tech Gadgets Fund", "Debt Payoff", "Health and Wellness", "Fitness Goals", 
    "New Home Deposit", "Dream Car Fund", "Business Investment", "Family Fund",
    "Child's Education", "Luxury Purchase Fund", "Vacation Trip", "Big Ticket Items"
]

def seed_users(num_users=10): 
    users = []
    for _ in range(num_users):
        user = User(name=fake.name(), email=fake.email())
        user.password = ("Password11!!") 
        # user.created_at = datetime.now()
        db.session.add(user)
        users.append(user)
    db.session.commit()
    return users

def seed_categories():
    category_objects = []
    for category_name in categories:
        category = Category(
            name=category_name,
            description=fake.sentence(nb_words=5),
            allocated_amount=randint(100, 10000)
        )
        category_objects.append(category)
        db.session.add(category)
    db.session.commit()
    return category_objects

def seed_expenses(budgets):
    expenses = []
    for budget in budgets:
        category_expenses = expenses_data.get(budget.category.name, [])
        for description in category_expenses:
            expense = Expense(
                description=description,
                amount=round(uniform(10.0, 1000.0), 2),
                date=fake.date_this_year(after_today=False, before_today=True),
                budget_id=budget.id 
            )
            expenses.append(expense)
            db.session.add(expense)
    db.session.commit()
    return expenses

def seed_budgets(users, categories, num_budgets=10):
    budgets = []
    for _ in range(num_budgets):
        name = choice(budget_names)
        description = budget_descriptions.get(name, fake.sentence(nb_words=8))
        start_date = fake.date_this_year(after_today=True, before_today=False)
        end_date = start_date + timedelta(days=randint(30, 365))

        # Add some basic error handling or logging here to avoid duplicates
        existing_budget = Budget.query.filter_by(name=name).first()
        if existing_budget:
            print(f"Budget with name {name} already exists, skipping...")
            continue

        budget = Budget(
            name=name,
            description=description,
            total_amount=round(uniform(100.0, 10000.0), 2),
            start_date=start_date,
            end_date=end_date,
            is_active=fake.boolean(),
            user_id=choice(users).id,
            category_id=choice(categories).id 
        )
        budgets.append(budget)
        db.session.add(budget)
    db.session.commit()
    return budgets

def seed_goals(users, num_goals=10):
    goals = []
    for _ in range(num_goals):
        user = choice(users)
        goal_amount = round(uniform(500.0, 5000.0), 2)
        goal_name = choice(goal_names)

        # Use start_date and end_date instead of date
        start_date = fake.date_this_year(after_today=False, before_today=True)
        end_date = start_date + timedelta(days=randint(30, 365))

        try:
            goal = Goal(
                name=goal_name, 
                goal_amount=goal_amount,
                current_savings=round(uniform(0.0, goal_amount), 2),
                is_completed=fake.boolean(chance_of_getting_true=30),
                start_date=start_date,  # Use start_date
                end_date=end_date,      # Use end_date
                user_id=user.id 
            )
            db.session.add(goal)
            goals.append(goal)
        except ValueError as e:
            print(f"Skipping goal creation for {goal_name} due to error: {e}")
            continue  # Continue with the next iteration if there's an error
    db.session.commit()
    return goals



def run_seeds():
    print("Seeding database...")
    
    with app.app_context():
        db.drop_all()
        db.create_all()

        users = seed_users()
        print(f"Seeded {len(users)} users.")

        categories = seed_categories()
        print(f"Seeded {len(categories)} categories.")

        budgets = seed_budgets(users, categories)
        print(f"Seeded {len(budgets)} budgets.")

        goals = seed_goals(users)
        print(f"Seeded {len(goals)} goals.")

        expenses = seed_expenses(budgets)
        print(f"Seeded {len(expenses)} expenses.")

    print("Seeding completed!")

if __name__ == "__main__":
    run_seeds()