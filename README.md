# SharingNE

Scambio file diretto tra i tuoi dispositivi sulla **stessa Wi-Fi**, peer-to-peer (WebRTC). Niente cloud, niente server intermedio: dopo un aggancio iniziale via QR, i file passano direttamente da un dispositivo all'altro.

## Contenuto della cartella
```
index.html            l'app
manifest.json         nome, icone, integrazione "Condividi" (Windows)
service-worker.js     installazione, uso offline, ricezione file condivisi
vendor/               librerie locali (QR, compressione) — nessuna dipendenza esterna
icons/                icone PNG (PC + iPhone) nelle misure necessarie
```

## 1. Pubblicare (serve HTTPS — un file aperto col doppio-click NON si installa)

Le PWA richiedono un URL `https://`. La via gratuita più semplice è **GitHub Pages**:

1. Crea un repository su GitHub, es. `sharingne`.
2. Carica **tutto il contenuto di questa cartella** nella radice del repo (index.html deve stare in cima, non dentro una sottocartella).
3. Repository → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch** → Branch: `main` / cartella `/root` → Save.
4. Dopo ~1 minuto avrai un URL tipo `https://TUONOME.github.io/sharingne/`.
5. Apri quell'URL su **entrambi** i dispositivi.

(In alternativa vanno bene Netlify, Cloudflare Pages, o qualunque hosting con HTTPS.)

## 2. Installare l'icona

**iPhone (Safari):** apri l'URL → tocca *Condividi* → **Aggiungi a Home**. Compare l'icona SharingNE e l'app si apre a tutto schermo.

**PC (Edge o Chrome):** apri l'URL → icona **Installa** nella barra indirizzi (o menu ⋮ → *Installa SharingNE*). Ottieni l'icona sul desktop e nel menu Start.

## 3. Usare

1. Apri SharingNE su entrambi i dispositivi (stessa Wi-Fi).
2. Su uno: **Crea l'aggancio** → mostra un QR.
3. Sull'altro: **Scansiona un aggancio** → inquadra il QR → genera un QR di risposta.
4. Sul primo: **Scansiona la risposta**.
5. Collegati: trascina/scegli i file da qualunque lato. Trasferimento bidirezionale con barra di avanzamento.

## Condivisione dal menu di sistema

- **Windows:** con l'app installata, SharingNE compare nella finestra *Condividi* del sistema. Puoi fare *Condividi → SharingNE* da altre app: i file arrivano già pronti nell'app (poi serve comunque un dispositivo collegato per inviarli).
- **iPhone:** iOS **non** permette a una web app di comparire nel menu Condividi (limite di WebKit, non aggirabile senza un'app nativa). Sull'iPhone il flusso è: apri l'icona SharingNE → scegli file/foto dall'app → invia.

## Requisiti / note

- I due dispositivi devono essere sulla **stessa rete Wi-Fi**.
- L'**AP isolation** sul router dev'essere disattivata (spesso attiva sulle reti *guest*).
- L'aggancio via QR serve una volta per sessione: WebRTC serverless non può ristabilire il collegamento da solo dopo una disconnessione.
- Nessun dato lascia la rete locale: le librerie sono incluse in `vendor/`, non si contatta alcun CDN.
