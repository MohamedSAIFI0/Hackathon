# AcademGuard - Plateforme Sécurisée pour Examens en Ligne

## À propos du Projet

AcademGuard est une plateforme web innovante conçue pour administrer des examens en ligne tout en prévenant la fraude académique. Le système intègre plusieurs portails pour différents types d'utilisateurs (étudiants, professeurs, administrateurs) et utilise des technologies avancées comme l'intelligence artificielle et la vision par ordinateur pour assurer l'intégrité des évaluations.

## Architecture du Projet

Le projet est composé de plusieurs modules interconnectés :

### 1. AcademyGuard (Backend Principal)

- **Technologies**: Flask, MySQL, Python
- **Fonctionnalités**: Gestion des utilisateurs, authentification, administration des examens, API REST
- **Description**: Serveur backend principal qui gère l'ensemble de la logique métier de la plateforme

### 2. Plateform (Interface Utilisateur)

- **Technologies**: React, TypeScript, Tailwind CSS, Vite
- **Fonctionnalités**: Interfaces pour étudiants, professeurs et administrateurs
- **Description**: Application frontend moderne fournissant une expérience utilisateur intuitive et responsive

### 3. API de Détection d'IA (api_ai_detector)

- **Technologies**: Flask, scikit-learn, SentenceTransformer
- **Fonctionnalités**: Détection de code généré par IA
- **Description**: Service qui analyse le code soumis pour déterminer s'il a été généré par une IA ou écrit par un humain

### 4. Système de Reconnaissance Faciale (RFAPI_DB)

- **Technologies**: Flask, OpenCV, face_recognition
- **Fonctionnalités**: Vérification d'identité des étudiants
- **Description**: API pour authentifier les étudiants via reconnaissance faciale avant et pendant les examens

### 5. Détection d'Objets (ObjectDetectionAPI)

- **Technologies**: TensorFlow Lite, Flask
- **Fonctionnalités**: Détection d'objets non autorisés pendant les examens
- **Description**: Système qui utilise la vision par ordinateur pour détecter les téléphones, livres ou autres objets interdits

### 6. Lecteur de Code-barres (BarCodeReader)

- **Technologies**: OpenCV, Flask
- **Fonctionnalités**: Numérisation de documents et lecture de codes-barres
- **Description**: Outil permettant de numériser et d'analyser des documents d'identité pour vérification

## Fonctionnalités Principales

1. **Authentification sécurisée**

   - Connexion avec vérification biométrique
   - Reconnaissance faciale pour confirmer l'identité des étudiants

2. **Surveillance anti-fraude**

   - Détection de multiples visages dans le champ de la caméra
   - Alerte lors de sortie de l'application d'examen
   - Détection d'objets non autorisés via la caméra

3. **Intégrité du code**

   - Détection de code généré par IA lors des examens de programmation
   - Vérification des commits Git pour suivre la progression des étudiants

4. **Gestion des examens**

   - Création d'examens avec différents types de questions
   - Configuration des paramètres de sécurité par le professeur
   - Suivi en temps réel des activités suspectes

5. **Administration**
   - Gestion des utilisateurs et des droits
   - Vérification des documents d'identité des étudiants
   - Tableau de bord pour le suivi des incidents

## Prérequis Techniques

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Navigateur moderne avec support WebRTC (pour accès à la caméra)

## Installation et Démarrage

### Backend AcademGuard

```bash
cd AcademGuard
pip install -r requirements.txt
python run.py
```

### Frontend Plateform

```bash
cd Plateform/frontend
npm install
npm run build
```

### API de Détection d'IA

```bash
cd api_ai_detector
pip install -r requirements.txt
python app.py
```

### Services de Vision par Ordinateur

```bash
cd ObjectDetectionAPI
pip install -r requirements.txt
python run_server.py
```

## Sécurité

La plateforme utilise plusieurs couches de protection :

- Authentification multi-facteurs
- Surveillance continue via caméra
- Détection d'activités suspectes en temps réel
- Vérification périodique de l'identité

## Contributeurs

- Mohamed Zouhair Rouissiya
- Mohamed Saifi
- Ayoub Samy

## Licence

Ce projet est protégé par droit d'auteur. Tous droits réservés.
