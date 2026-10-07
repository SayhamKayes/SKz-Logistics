# Virtual Environment Directory: sain_env

To activate this virtual environment on your local system:

```bash
# On Linux / macOS:
python3 -m venv sain_env
source sain_env/bin/activate

# On Windows:
python -m venv sain_env
sain_env\\Scripts\\activate

# Install requirements:
pip install -r requirements.txt

# Run migrations:
python manage.py makemigrations
python manage.py migrate

# Run local development server:
python manage.py runserver 0.0.0.0:8000
```
