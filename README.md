# Hidden Adventures Player v1.0.1

Oprava produkčního načítání:
- autorizovaný obsah hry se vrací už v odpovědi start_or_resume_game,
- Player už nemusí dělat druhý RPC požadavek po ověření kódu,
- tím se odstranilo zaseknutí na „Načítám rozehranou hru…“,
- při chybě se Player vrátí na zadání kódu a zobrazí konkrétní hlášku místo nekonečného čekání.

Bezpečnostní model z v1.0 zůstává zachovaný: obsah dostane jen platná session a registrované zařízení.
