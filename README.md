# 👶 Baby Tracker App

## 🇬🇧 English Version

### 📘 Description
Baby Tracker is a cross-platform application (Web, iOS, Android) to monitor daily newborn activities and health.  
It allows recording events such as **feeding, sleep, diapers, vitamins, weight, and height**, while providing **summaries and charts** for better tracking and planning.

### 🚀 Key Features (V1)
- Event logging (Feed, Sleep, Diapers, Vitamins, Weight, Height).  
- Daily log view, filterable by date and event type.  
- Dark mode toggle.  
- Backup, export, and import in JSON.  
- Multilanguage support (starting with English).  

### 🛠️ Tech Stack
- **Web:** React + Vite + TypeScript (PWA, mobile-first).  
- **Mobile:** Expo React Native (TypeScript) for iOS and Android.  
- **Shared domain:** `@baby/domain` package in TypeScript.  
- **State management:** React Query (server cache) + Zustand (UI/domain state).  
- **Offline support:**  
  - Web → IndexedDB (Dexie).  
  - Mobile → SQLite (expo-sqlite).  

### 📦 Project Structure (simplified)
```
/web          → Web App (PWA)
/mobile       → Mobile App (Expo React Native)
/packages
   /domain    → Shared domain logic (events, models, validation)
```

### 📈 Next Steps
- Improved UI/UX for multiple events.  
- Advanced charts and summaries (SQL aggregations + React Query).  
- Persistent user preferences (theme, language).  
- Extended localization (multi-language).  

---

## 🇮🇹 Versione Italiana

### 📘 Descrizione
Baby Tracker è un’applicazione multipiattaforma (Web, iOS, Android) per monitorare le attività quotidiane e la salute del neonato.  
Permette di registrare eventi come **alimentazione, sonno, pannolini, vitamine, peso e altezza**, fornendo **riepiloghi e grafici** per un migliore controllo e pianificazione.

### 🚀 Funzionalità principali (V1)
- Registrazione eventi (Feed, Sleep, Diapers, Vitamins, Weight, Height).  
- Vista giornaliera filtrabile per data e tipo di evento.  
- Dark mode con toggle.  
- Backup, esportazione e importazione in JSON.  
- Supporto multilingua (inizialmente solo inglese).  

### 🛠️ Stack Tecnologico
- **Web:** React + Vite + TypeScript (PWA, mobile-first).  
- **Mobile:** Expo React Native (TypeScript) per iOS e Android.  
- **Dominio condiviso:** pacchetto `@baby/domain` in TypeScript.  
- **Gestione stato:** React Query (server cache) + Zustand (UI/domain state).  
- **Supporto offline:**  
  - Web → IndexedDB (Dexie).  
  - Mobile → SQLite (expo-sqlite).  

### 📦 Struttura progetto (semplificata)
```
/web          → App Web (PWA)
/mobile       → App Mobile (Expo React Native)
/packages
   /domain    → Logica condivisa (eventi, modelli, validazioni)
```

### 📈 Prossimi step
- Miglioramento UI/UX per eventi multipli.  
- Grafici e riepiloghi avanzati (SQL aggregations + React Query).  
- Preferenze utente persistenti (tema, lingua).  
- Estensione localizzazione multilingua.  
