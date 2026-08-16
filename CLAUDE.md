# Project Overview
This repository contains a full-stack inventory management system.
- **Frontend**: React (Vite)
- **Backend**: Django & Django REST Framework

## Backend Structure & Conventions
Location: `/Backend`

- **config/**: Project-level settings (base, development, production). Includes `urls.py`, `wsgi.py`, `asgi.py`.
- **apps/**: All Django apps live here. Each app should remain modular.
  - **users**: Handles JWT auth and roles (`Admin`, `Customer`). Contains custom permissions.
  - **products**: Product management (Add/Edit/Delete), Search, Filter (using `django-filter`).
  - **categories**: Category management.
  - **inventory**: Manages stock and low stock logic. Includes `signals.py` for auto stock decrease on orders.
  - **orders**: Order creation, status updates, cancellations, and history. Contains `services.py` for business logic (stock check, total calculation, transactions).
  - **dashboard**: Admin and Customer dashboard statistics.
- **core/**: Shared/reusable code across apps.
  - `pagination.py`, `permissions.py`, `exceptions.py`, `mixins.py`, `utils.py`, `validators.py`.
- **media/**: Uploaded images/files.
- **static/**: Static files.
- **docker/**: Contains `Dockerfile` and `docker-compose.yml`.

### Backend Rules
- Do NOT use generic generic colors or designs.
- Always use the custom permissions and exceptions located in `core/` when applicable.
- Keep business logic inside `services.py` rather than views.

## Frontend Structure & Conventions
Location: `/frontend`

- **public/**: Public assets.
- **src/**: Main source code.
  - **assets/**: Images and icons.
  - **components/**: Reusable UI components organized by feature (`common`, `product`, `category`, `order`, `cart`, `dashboard`).
  - **pages/**: Page-level components organized by roles:
    - **auth**: Login/Register
    - **admin**: Admin-specific pages (Dashboard, Products, Categories, Stock, Orders).
    - **customer**: Customer-specific pages (Dashboard, Shop, ProductDetail, Cart, Orders).
    - **errors**: Error pages (404, etc.)
  - **context/**: React Context API providers.
  - **hooks/**: Custom React hooks.
  - **services/**: API integration services.
  - **routes/**: Application routing.
  - **utils/**: Helper functions.
  - **styles/**: Global CSS styles.

### Frontend Rules
- Use modern web design principles (vibrant colors, glassmorphism, dynamic animations).
- Prioritize high-quality typography (Inter, Roboto, Outfit) over browser defaults.
- No Tailwind CSS unless explicitly requested and version confirmed. Use Vanilla CSS by default.
- Include SEO best practices on every page (Title Tags, Meta Descriptions, Semantic HTML).
