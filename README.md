# Hidden Adventures Player v1.0.2

Oprava načítání po zadání kódu:
- ověření kódu a načtení obsahu teď probíhá přes samostatný serverový endpoint,
- backend interně obnoví session a načte autorizovaný obsah,
- Player dostane session i obsah v jedné odpovědi,
- přidán 15s timeout a konkrétní chybové hlášky,
- původní start_or_resume_game je vrácen do stabilní podoby z předchozí verze.

Bezpečnostní model zůstává zachovaný: obsah není veřejně dostupný bez platného kódu/session.
