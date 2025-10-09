# 🚀 Guidelines de Développement - Projet Bambin

## 📋 Instructions

### 🔧 **Avant chaque modification de code**

1. **Vérifier la structure existante**

   - Lire le fichier à modifier pour comprendre l'architecture
   - Identifier les patterns et conventions utilisés
   - Respecter le style de code existant

2. **Planifier l'approche**

   - Définir clairement ce qui doit être modifié
   - Identifier les dépendances et impacts
   - Prévoir les tests nécessaires

### 🎯 **Conventions de Code**

#### **Vue.js / TypeScript**

- Utiliser `<script setup lang="ts">` pour les composants Vue
- Importer les types depuis `../utils/api` pour les interfaces
- Utiliser `ref()` pour les variables réactives
- Préfixer les variables avec leur type : `isLoading`, `errorMsg`, `successMsg`

#### **Nommage**

- **Variables** : camelCase (`newUser`, `userToDelete`)
- **Fonctions** : camelCase (`fetchUsers`, `addUser`)
- **Composants** : PascalCase (`UserForm`, `NavigationSidebar`)
- **Fichiers** : kebab-case (`child-section.ts`, `mock-data.ts`)

#### **Structure des composants**

```vue
<script setup lang="ts">
// 1. Imports
import { ref, onMounted } from "vue";
import { ... } from "../utils/api";

// 2. Variables réactives
const data = ref<Type[]>([]);
const isLoading = ref(false);
const errorMsg = ref("");

// 3. Fonctions
const fetchData = async () => { ... };
const addItem = async () => { ... };

// 4. Lifecycle
onMounted(() => { ... });
</script>
```

### 🗂️ **Organisation des fichiers**

#### **API Backend** (`api/`)

- Créer un fichier par entité : `users.ts`, `children.ts`, `activities.ts`
- Inclure validation des champs obligatoires
- Gérer les erreurs avec try/catch
- Protection contre les requêtes démo

#### **API Client** (`src/utils/api.ts`)

- Ajouter l'interface TypeScript pour l'entité
- Créer les fonctions CRUD : `fetchX`, `addXApi`, `deleteXApi`
- Gérer les erreurs avec messages appropriés
- Support du mode démo

#### **Données factices** (`src/utils/mock-data.ts`)

- Centraliser toutes les données de test
- Exporter avec des noms explicites : `fakeUsers`, `fakeChildren`
- Maintenir la cohérence avec les interfaces

### 🎨 **UI/UX Guidelines**

#### **Formulaires**

- Utiliser des classes Bulma : `input`, `button`, `select`
- Ajouter `required` sur les champs obligatoires
- Gérer les états de chargement : `:disabled="isLoading"`
- Afficher les erreurs avec `errorMsg`

#### **Listes**

- Utiliser `v-for` avec `:key` unique
- Afficher les données avec des cartes Bulma
- Inclure des boutons d'action (suppression, édition)
- Gérer le mode démo avec des données factices

#### **Modales**

- Confirmation de suppression obligatoire
- Boutons "Annuler" et "Confirmer"
- Messages de succès temporaires (2 secondes)

### 🔒 **Sécurité et Permissions**

#### **Protection des routes**

- Vérifier l'authentification avec `requiresAuth`
- Contrôler les rôles : `role: ["admin", "parent"]`
- Rediriger vers `/` si non autorisé

#### **Mode Démo**

- Désactiver les actions destructives en mode démo
- Afficher des données factices
- Utiliser la directive `v-disable-demo`

### 🧪 **Tests et Qualité**

#### **Avant de soumettre**

- Tester les fonctionnalités ajoutées
- Vérifier la cohérence avec l'existant

#### **Gestion des erreurs**

- Toujours utiliser try/catch pour les appels API
- Afficher des messages d'erreur utilisateur
- Logger les erreurs côté serveur

#### **Sécurité des tests**

- **NE JAMAIS** utiliser de vrais tokens JWT dans les tests publics
- Utiliser des tokens de test avec signature factice (`test-signature`)
- Les tokens de test ne doivent pas fonctionner avec le vrai `JWT_SECRET`

### 📝 **Documentation**

#### **Commentaires**

- Expliquer la logique complexe
- Tous les commentaires sont rédigés en anglais

#### **Messages utilisateur**

- Messages en français pour l'interface
- Messages d'erreur explicites
- Feedback positif pour les actions réussies

### 🔄 **Workflow de développement**

1. **Analyser** le besoin et la structure existante
2. **Planifier** l'implémentation
3. **Implémenter** en respectant les conventions
4. **Tester** les fonctionnalités
5. **Nettoyer** le code (supprimer les fichiers temporaires)
6. **Documenter** les changements importants

### ⚠️ **Points d'attention**

- **Toujours** vérifier les imports après modification
- **Respecter** l'architecture existante
- **Tester** en mode démo et en mode normal
- **Vérifier** la responsivité mobile
