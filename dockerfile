FROM rabbitmq:3.11.11-management

# Set the RabbitMQ default user and password
ENV RABBITMQ_DEFAULT_USER=myuser
ENV RABBITMQ_DEFAULT_PASS=mypassword

# Expose the necessary ports
EXPOSE 15672 5672
