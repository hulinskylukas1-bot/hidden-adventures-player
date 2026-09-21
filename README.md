# Hidden Adventures Player v0.9

Veřejná HTTPS verze Playeru pro Spiknutí.

Nově ve v0.9:
- skutečný graf přechodů mezi částmi hry,
- podmíněné přechody podle odpovědi ve volbě,
- více možných konců: část bez odpovídajícího odchozího přechodu je konec hry,
- přechod může vést i na dřívější nebo vzdálenější část; postup už není svázaný jen číslem části,
- synchronizace používá monotónní progressStep, takže funguje i u nelineárního průchodu,
- archiv dokumentů vychází z bloků, které hráč skutečně viděl, ne z lineární pozice.

Pokud nejsou nastavené žádné podmíněné přechody, Spiknutí se chová stejně jako dosud.
