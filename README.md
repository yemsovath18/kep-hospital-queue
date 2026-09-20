# Hospital Queue System — GitHub Pages

This version keeps Google Apps Script + Google Sheets as the backend and hosts the
three user interfaces on GitHub Pages.

## Files

- `index.html` — patient kiosk / take ticket
- `staff.html` — staff control panel
- `display.html` — TV/public display + audio
- `api.js` — GitHub Pages → Google Apps Script API bridge
- `Code_GitHub_API_Patch.gs` — backend changes required in Apps Script

The original Google Apps Script Web App can remain available at:

`'https://script.google.com/macros/s/AKfycbxCRXvqDsG9qHhl9QSu358Sggehtv1ocu0cG-fZVz34yUQjqzaIOlDVhegRmIAGQx7VNw/exec'`

## Important backend change

In your Apps Script project, keep the existing `Code.gs` and `AudioData.gs`.
Replace the existing `doGet(e)` with the `doGet(e)` from
`Code_GitHub_API_Patch.gs`, and add `handleApiRequest_(p)`.

Then create a **new deployment version** of the Web App.

Use:
- Execute as: **Me**
- Who has access: **Anyone** (or your required internal access setting)

Do NOT paste `Code_GitHub_API_Patch.gs` as a second file containing another `doGet`.
It is a patch: copy its functions into the existing backend.

## GitHub Pages

Upload these four website files to the repository root:

```text
index.html
staff.html
display.html
api.js
```

Then enable GitHub Pages from the repository settings.

## Result

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/staff.html
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/display.html
```

The Google Sheet remains the `QUEUE` database. The audio remains in your
existing `AUDIO_DATA` / `AudioData.gs` backend; the GitHub display fetches clips
on demand.
