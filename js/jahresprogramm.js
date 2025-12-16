(async () => {
  const listEl = document.getElementById('events-list');
  if (!listEl) return;

  try {
    const res = await fetch('/data/jahresprogramm.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const events = Array.isArray(data.events) ? data.events : [];

    // Sortierung nach ISO-Datum (aufsteigend)
    events.sort((a, b) => (a.date_iso || '').localeCompare(b.date_iso || ''));

    listEl.innerHTML = '';

    for (const ev of events) {
      const card = document.createElement('div');
      card.className = 'event-card';

      // ISO-Datum nur als Attribut (nicht sichtbar), falls du später filtern/debuggen willst
      if (ev.date_iso) card.setAttribute('data-date', ev.date_iso);

      const timeLine = ev.time
        ? `<p><strong>Uhrzeit:</strong> ${ev.time} Uhr</p>`
        : '';

      card.innerHTML = `
        <h3>${ev.title_date || ''}</h3>
        <p>${ev.text_html || ''}</p>
        ${ev.date_label ? `<p><strong>Datum:</strong> ${ev.date_label}</p>` : ''}
        ${timeLine}
      `;

      listEl.appendChild(card);
    }
  } catch (err) {
    console.error('Jahresprogramm konnte nicht geladen werden:', err);
    listEl.innerHTML = '<p>Jahresprogramm konnte nicht geladen werden.</p>';
  }
})();
