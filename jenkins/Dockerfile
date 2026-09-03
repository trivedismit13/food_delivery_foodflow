# Start from the current Jenkins LTS image used by FoodFlow
FROM jenkins/jenkins:lts-jdk21

# Switch to root to install packages
USER root

# Install prerequisites, add Docker's official GPG key, set up the repository,
# and install ONLY the Docker CLI (docker-ce-cli), avoiding the docker-ce daemon.
# This keeps the image minimal and avoids running Docker-in-Docker.
RUN apt-get update && apt-get install -y ca-certificates curl gnupg \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Switch back to the standard jenkins user to keep permissions intact
USER jenkins
