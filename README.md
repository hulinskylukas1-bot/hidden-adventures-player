# Hidden Adventures Player v0.7

Veřejná HTTPS verze Playeru pro Spiknutí.

Nově ve v0.7:
- univerzální nápovědy z `config.hints` nebo `content.hints`, včetně logování použití,
- skutečná řadicí úloha s přesouváním položek nahoru/dolů a validací přes `correct_order`,
- pokud správné pořadí ještě není potvrzené, Player dovolí testovací uložení bez předstírání, že jde o správné řešení,
- maskované odpovědi používají přímo `content.placeholder` / `config.placeholder` (např. `-------- ---- & ------`),
- zachována synchronizace více zařízení, GPS a privátní fotodůkazy z v0.6.

Testovací kód: `TEST-SPIKNUTI`.

Poznámka: správné pořadí u sv. Mikuláše je v datech stále označené jako `pending`; v0.7 proto tuto úlohu umí technicky odehrát, ale její finální validace čeká na potvrzené pořadí z terénu.
