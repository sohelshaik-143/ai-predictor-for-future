# Use slim Python 3.10 image for lightweight container
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy only requirements first (for caching)
COPY requirements.txt .

# Install dependencies without cache
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./app ./app

# Expose port for the ML API
EXPOSE 8001

ENV PORT=8001

# Python reads PORT from env directly — works on all container platforms
CMD ["python", "-c", "import os,uvicorn; uvicorn.run('app.main:app', host='0.0.0.0', port=int(os.environ.get('PORT',8001)))"]