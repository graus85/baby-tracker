# Baby Tracker – Starter Repo (Web + Supabase) V1

Minimal starter per mettere **subito in pista** il progetto su **GitHub + Vercel + Supabase**.
Include:
- Web app (React + Vite + TypeScript) con login Supabase e log giornaliero base
- PWA (vite-plugin-pwa)
- CI/CD GitHub Actions per deploy su Vercel
- Migrazioni SQL con RLS per tutte le tabelle
- Guide passo‑passo per principianti

> Obiettivo: fare *deploy end‑to‑end in meno di 30 minuti* partendo da zero.

## Struttura
```
.
├─ web/                      # App web (Vite + React + TS)
├─ supabase/
│  ├─ migrations/            # SQL per schema + RLS + view v_day_data
│  └─ seed/                  # Seed opzionale
└─ .github/workflows/        # CI per deploy web su Vercel
```
