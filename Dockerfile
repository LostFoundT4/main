# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG PYTHON_VERSION=3.11.5
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1


RUN pip install --upgrade pip
COPY ../requirements.txt /usr/bin
RUN chmod +x /usr/bin/requirements.txt
RUN pip install -r /usr/bin/requirements.txt

RUN pip install psycopg2-binary==2.9.9

RUN pip install gunicorn==21.2.0

WORKDIR .

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

RUN echo pwd

COPY docker-entrypoint.sh /usr/bin/

RUN chmod +x /usr/bin/docker-entrypoint.sh

ENTRYPOINT [ "/usr/bin/docker-entrypoint.sh" ]

RUN apt-get -y update && apt-get -y install procps
RUN apt-get -y update && apt-get -y install nginx
RUN python -m pip install redis


# Expose the port for access
EXPOSE 80/tcp
# Run the Nginx server
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]


# Switch to the non-privileged user to run the application.
USER appuser

# Copy the source code into the container.
COPY ../.. .

# Expose the port that the application listens on.
#EXPOSE 8080

# Run the application.
#CMD python manage.py runserver 0.0.0.0:8080