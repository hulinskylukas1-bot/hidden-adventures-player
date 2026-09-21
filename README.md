# Hidden Adventures Player v1.0

Produkční základ Playeru.

Bezpečnostní změna:
- obsah hry se už nenačítá přes veřejné preview podle slugu,
- Player nejdřív ověří unikátní kód, vytvoří / obnoví session a zařízení,
- celý obsah se následně vydá pouze přes session_token + device_token,
- session je pevně svázaná s konkrétní game_version_id,
- veřejný anonymní přístup k get_game_preview byl odebrán.

Zachováno:
- historie rozehrané hry,
- restart / pokračování,
- synchronizace zařízení,
- archiv, GPS, fotodůkazy, nápovědy, větvení a více konců.

Poznámka: Spiknutí je stále draft verze, takže testovací kódy dál fungují. Před skutečným prodejem bude potřeba publikovat finální verzi a napojit objednávku / platbu na vydání licence.
