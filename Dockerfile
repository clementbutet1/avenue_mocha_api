# Utilisation d'une image NodeJS LTS (Long-term support)
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 8000

# Définir l'instruction de démarrage
CMD [ "npm", "start" ]
