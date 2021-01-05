# Zenith

Google Sheets add-on to assist in use of Riot API.

# Generating docs

```
cd app
jsdox match.js
jsdox summoner.js
```

Defaults into `output` directory.

# Development and deployment

This repository can be cloned using

```
git clone git@github.com:samhine/zenith.git
```

To publish changes to the app script remotely, use [`clasp`](https://developers.google.com/apps-script/guides/clasp).

```
npm install @google/clasp -g
clasp login
```

After you make changes you can deploy using the following

```
cd app
clasp push
```
