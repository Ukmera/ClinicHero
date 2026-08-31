# 🩺 ClinicHero - Plateforme d'Apprentissage Sémiologique Médical Gamifié

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-1e293b)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)](https://www.typescriptlang.org/)

**ClinicHero** est une application web moderne et gamifiée d'apprentissage de la sémiologie clinique médicale (inspirée de l'ergonomie pédagogique de Duolingo et Babbel).

---

## 🚀 Fonctionnalités Clés (Version 1.0 - Cardiovasculaire)

- **Parcours Cardiovasculaire Complet (3 Modules, 9 Leçons)** :
  - *Module 1 : Signes fonctionnels & Symptômes* (Douleur thoracique & angor, dyspnée & insuffisance cardiaque, palpitations & syncopes).
  - *Module 2 : Examen clinique physique* (Palpation des pouls de haut en bas, bruits B1/B2/B3/B4, souffles cardiaques & manœuvres dynamiques).
  - *Module 3 : Examens complémentaires* (ECG 12 dérivations, radio de thorax & biomarqueurs, échocardiographie Doppler).
- **Atelier des Simulateurs Cliniques Virtuels (`/simulations`)** :
  - **Simulateur de Pression Artérielle** : Mascottes patients interactives (Lapin, Panda, Souris, Renard), brassard qui gonfle visuellement en temps réel, synthèse acoustique en direct des phases I à V de Korotkoff, cadran anéroïde et scoring de précision.
  - **Stéthoscope Virtuel** : Auscultation des 4 foyers anatomiques (Aortique, Pulmonaire, Tricuspide, Mitral), égaliseur sonore et mode défi aveugle.
- **Moteur Pédagogique Gamifié** :
  - Cartes d'entraînement interactives (QCM, Vrai/Faux, Associations, Ordre chronologique, Cas cliniques concrets).
  - Système de Répétition Espacée (SRS / SuperMemo-2) sur `/review`.
  - XP, niveaux, séries de jours consécutifs (*streaks*), animations et confettis.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 15 (App Router), React 19, TypeScript, Lucide Icons, Canvas Confetti.
- **Design System** : Tailwind CSS v3.4, Google Font Plus Jakarta Sans, styles 3D Duolingo.
- **Backend & Base de données** : SQLite local avec Prisma ORM 6.4, API Routes Next.js.
- **Audio & Simulations** : Web Audio API pour la synthèse acoustique en temps réel.
- **Authentification** : Sessions JWT sans état avec `jose` et `bcryptjs`.

---

## 💻 Installation & Démarrage Rapide

### 1. Cloner le dépôt
```bash
git clone https://github.com/VOTRE_NOM/ClinicHero.git
cd ClinicHero
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
```

### 4. Initialiser la base de données et injecter le contenu médical
```bash
# Crée les tables SQLite
npx prisma db push

# Injecte l'ensemble des 9 leçons, glossaire et questions
npm run seed
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez votre navigateur sur **[http://localhost:3000](http://localhost:3000)**.

---

## 📚 Références Médicales Utilisées
Les cours et cas cliniques sont rigoureusement extraits et sourcés à partir des traités de référence :
- *Sémiologie médicale* (Dr Baptiste Coustet)
- *Sémiologie clinique* (Pr Jean Bariéty, Pr Loïc Capron)
- *Guide de l'examen clinique* (Barbara Bates, Lynn Bickley)
- *Evidence-Based Physical Diagnosis* (Dr Steven McGee)
- *Essentials of Bedside Cardiology* (Dr Jules Constant)
- *Polycopié de sémiologie cardiologique* (Collège National des Enseignants de Cardiologie - CNEC)
