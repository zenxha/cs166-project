# Use official Postgres image
FROM postgres:15

# Copy the schema and data setup scripts to the container
COPY ./src /docker-entrypoint-initdb.d/

# Copy data files into a known location inside the container
COPY ./data /data

# Ensure the data files are accessible when running the COPY command