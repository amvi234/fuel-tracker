# Fuel Tracker Tool

A full stack web solution to
- helps drivers record fuel fill-ups and analyze consumption and costs over time.
- log each fill-up from a receipt (station name, fuel brand/grade, total paid, liters), record odometer (mileage).
- view history plus statistics (e.g., cost per liter, consumption, distance per liter, cost per km/mi, rolling averages, per-brand comparisons).

## Simple Commands to run this project:-

```bash
git clone https://github.com/amvi234/fuel-tracker.git
&& docker compose up --build
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

### Screenshots

<img width="959" height="472" alt="image" src="https://github.com/user-attachments/assets/bc019ee0-a165-4fab-b7aa-76769bda6bc7" />
<img width="958" height="471" alt="image" src="https://github.com/user-attachments/assets/2d84c694-aa19-46fa-a280-a78d604ec166" />
<img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/c13c3ab6-f8f8-47a8-b92f-828b1a11ce14" />
<img width="955" height="479" alt="image" src="https://github.com/user-attachments/assets/dd8627ce-cda9-4153-a216-5b25ba3472d5" />
<img width="959" height="475" alt="image" src="https://github.com/user-attachments/assets/25ae3c3f-d9e9-4d87-91fc-a85cd9a6ed0c" />
<img width="959" height="473" alt="image" src="https://github.com/user-attachments/assets/8e51c0a6-a699-47e2-8b52-a8ad6299ec5c" />

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
