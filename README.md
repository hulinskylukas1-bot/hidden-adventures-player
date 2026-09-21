# Hidden Adventures Player v0.6 — GPS a fotodůkazy

Veřejná HTTPS verze Playeru pro Spiknutí.

Nově:
- vychází ze stabilní v0.5.3 se synchronizací více zařízení,
- podporuje bloky `gps` i `gps_confirmation`,
- GPS používá skutečnou polohu telefonu a ukládá souřadnice, přesnost, čas, vzdálenost a výsledek validace,
- pokud cílové souřadnice nejsou nastavené, poloha se uloží jako evidence s `validated: false`,
- fotografie se skutečně nahrává do privátního bucketu `game-evidence`,
- fotodůkaz se zapisuje do tabulky `evidence` a synchronizuje do společného postupu,
- zachována je synchronizace až tří zařízení pomocí polling mechanismu.

Testovací kód: `TEST-SPIKNUTI`.

GPS v mobilním prohlížeči vyžaduje HTTPS.