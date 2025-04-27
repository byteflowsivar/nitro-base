# Dockerfile optimizado para entorno de desarrollo con Node.js
# Utiliza una imagen base oficial de Ubuntu
FROM ubuntu:latest

# Argumentos para configuración
ARG NODE_VERSION=22.11.0
ARG USER_NAME=devuser
ARG USER_ID=1001
ARG GROUP_NAME=devgroup
ARG GROUP_ID=1001
# Argumento para fecha de liberación dinámica
ARG BUILD_DATE

# Etiquetas para la imagen
LABEL version="${NODE_VERSION}"
LABEL maintainer="Victor Hugo Cornejo Calderon"
LABEL release-date="${BUILD_DATE}"
LABEL promoted="true"

# Evita prompts interactivos durante la instalación de paquetes
ENV DEBIAN_FRONTEND=noninteractive

# Actualiza el sistema e instala dependencias necesarias
# Agrupamos comandos para reducir capas y limpiamos cachés para reducir tamaño
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    xz-utils \
    ca-certificates \
    git \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crea usuario y grupo para el entorno de desarrollo
RUN groupadd --gid $GROUP_ID $GROUP_NAME || true && \
    useradd --uid $USER_ID --gid $GROUP_ID --shell /bin/bash --create-home $USER_NAME

# Instala Node.js usando el script oficial de NodeSource para mejor compatibilidad
RUN ARCH=$(dpkg --print-architecture) \
    && case "${ARCH}" in \
       amd64) ARCH='x64';; \
       arm64) ARCH='arm64';; \
       armhf) ARCH='armv7l';; \
       i386) ARCH='x86';; \
       ppc64el) ARCH='ppc64le';; \
       s390x) ARCH='s390x';; \
       *) echo "Arquitectura no soportada: ${ARCH}"; exit 1 ;; \
    esac \
    && curl -fsSLO --insecure --compressed "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${ARCH}.tar.xz" \
    && tar -xJf "node-v${NODE_VERSION}-linux-${ARCH}.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
    && rm "node-v${NODE_VERSION}-linux-${ARCH}.tar.xz" \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
    # Verificación de instalación
    && node --version \
    && npm --version

# Instala herramientas globales de desarrollo
RUN npm install -g yarn \
    && npm cache clean --force \
    # Verificación de instalación
    && yarn --version

# Configura el directorio de trabajo para la aplicación
WORKDIR /home/${USER_NAME}/nitro-base

# Cambia la propiedad del directorio de trabajo al usuario no privilegiado
RUN chown -R ${USER_NAME}:${GROUP_NAME} /home/${USER_NAME}/nitro-base

# Cambia al usuario no privilegiado para operaciones seguras
USER ${USER_NAME}

# Configura npm para guardar paquetes en el directorio del proyecto
RUN npm config set prefix ~/.npm-global && \
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc

# Configuración para que npm no cree package-lock.json en modo desarrollo
RUN npm config set package-lock false

# Expone los puertos relevantes para aplicaciones Node.js
# Puerto 3000: Común para Express y aplicaciones Node.js
# Puerto 8080: Común para NextJS y otros frameworks
EXPOSE 3000 8080 9092

# Comando predeterminado para iniciar un shell interactivo
CMD ["bash"]