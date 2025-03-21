*BAMBIN EBAUCHE CAHIER DES CHARGES*

# 1. Présentation générale du projet

### Contexte et objectifs

L’application vise à améliorer la communication entre les crèches et les parents en proposant un espace sécurisé de partage multimédia, de suivi des activités quotidiennes et d’échange d’informations.

### Public cible

- Parents d’enfants inscrits en crèche
- Personnel de crèche

### Besoins
- Administrateur (directeur de crèche) :
    - gestion des paramètres globaux et configuration des droits d'accès
- Personnel de crèche :
    - Publication de contenus multimédias
    - Rédaction des journaux d'activités
    - Communication avec les parents
- Parents :
    - Consultation des contenus partagés
    - Réception des notifications et messages


# 2. Fonctionnalités

### Partie gestion de comptes
- création compte utilisateur
- gestion compte utilisateur

### Partie partage multimédia - galerie photo
- Upload sécurisé de photos et sons
- Tagging des enfants sur les photos
- Validation des autorisations parentales
- Gestion des droits à l'image

### Partie journal d’activités
- Création d’un journal quotidien par le personnel encadrant
- Ajout de descriptions des activités (jeux, apprentissages)

### Partie correspondance
- Système de messagerie
- Notifications
- Historique des échanges


# 3. Technologies et architecture technique

Front-end : Vue.js  
Back-end : Node.js  
Orm : à définir  
Base de données : à définir  
Stockage des médias : à définir  
Authentification : à définir  
Gestion des permissions et rôles utilisateurs (Parents, Personnel de crèche, Admin)
![schéma](https://github.com/user-attachments/assets/30e2a2d1-f78c-4a2e-b3a7-aa18965ce519)


# 4. Sécurité et réglementation

- Protection des données :
    - Conformité RGPD  
    - Accès aux médias restreint aux parents concernés  
    - Consentement explicite pour l’utilisation des photos  
    - Droit de rectification et d'effacement  
    - Durée conservation des données sur les enfants : https://www.cnil.fr/fr/cnil-direct/question/combien-de-temps-une-creche-peut-elle-conserver-des-informations-sur-les  
- Authentification :
    - Système de connexion sécurisée avec gestion des mots de passe
    - Gestion des rôles utilisateurs

# 5. Planning

Phase 1: Conception et Design   
Phase 2: Développement   
Phase 3: Tests et Validation    
Phase 4: Déploiement   

# 6. Ressources nécessaires

IDE : Visual Studio Code   
Gestion de version : Git   
Hébergement : à définir   
