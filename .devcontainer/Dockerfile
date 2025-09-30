FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install pnpm
RUN npm install -g pnpm@8

# Install Prisma CLI
RUN npm install -g prisma

# Install MeiliSearch CLI
RUN curl -L https://install.meilisearch.com | sh
RUN mv ./meilisearch /usr/local/bin/

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN rm -rf aws awscliv2.zip

# Install additional tools
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    jq \
    curl \
    wget \
    git \
    vim \
    nano \
    htop \
    tree \
    && rm -rf /var/lib/apt/lists/*

# Set up workspace
WORKDIR /workspace

# Create non-root user
RUN useradd -m -s /bin/bash node
RUN chown -R node:node /workspace
USER node

# Set up shell
RUN echo 'export PS1="\[\033[01;32m\]\u@tdc-market\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "' >> /home/node/.bashrc

# Install global npm packages
RUN npm install -g \
    @types/node \
    typescript \
    ts-node \
    nodemon \
    concurrently

# Set environment variables
ENV NODE_ENV=development
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Expose ports
EXPOSE 3000 3001 3002 5432 6379

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version && pnpm --version

# Default command
CMD ["bash"]

