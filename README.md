# Fuel Tracker Tool

A full stack web solution to
- helps drivers record fuel fill-ups and analyze consumption and costs over time.
- log each fill-up from a receipt (station name, fuel brand/grade, total paid, liters), record odometer (mileage).
- view history plus statistics (e.g., cost per liter, consumption, distance per liter, cost per km/mi, rolling averages, per-brand comparisons).

## Simple Commands to run this project:-

```bash
git clone https://github.com/amvi234/fuel-tracker.git
&& docker compose up
 ```


## 🛠️ Tech Stack

This project uses the following technologies:

### Frontend

- React.js
- Typescript
- Tailwind CSS

### Backend

- Django
- SQLite

### Development Tools

- Python 12
- Node.js 20+
- Docker



## Setup to run this project:-

## Frontend

- Move to frontend directory:-
```bash
cd frontend
 ```

- Install all packages from node with:-
```bash
npm install
 ```

- Run the server with:-
```bash
npm run dev
```

## Backend
- Move to backend directory:-
```bash
cd backend
 ```
- Create a virtual environment with:-
```bash
python -m venv virtual_env
```

- Activate using:-
```bash
source virtual_env\bin\activate
```

- Install dependencies
```bash
pip install -r requirements.txt
```

- Run sever
```bash
python manage.py runserver
```
