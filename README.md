# motorcortex-plugin-starter

## Purpose

A starter plugin for creating MotorCortex plugins.

## Structure and Contents

It includes:

- rollup configuration & ready to use build tools
- a pre-configured webpack for the needs of the demo
- pre-configured eslint and babel
- and a set of ready to work on, Incidents:
  - **Effect**, for developing a custom Effect
  - **HTMLClip**, for developing a pre-configured HTML Clip with HTML, CSS and Incidents
  - **Combo**, for developing custom, pre-configured Combos
  - **Clip**, for developing custom browser Clips, such as canvas

These Incidents are the starting point for developing a plugin. They extend the right
Classes from MotorCortex SDK and they have blank implementations of all the methods that
should or can be overwritten, with comments.

Along with the comments you can always refer to <a href="https://docs.motorcortexjs.com/" target="_blank">MotorCortex documentation</a>
for detailed information on how to implement a plugin.

## How to use

Once you've decided what exactly your pluign is going to do and once we've decided on the type of Incident(s)
you need to implement, you can start directly from the basic/blank implementations and either work on them directly
or just copy them.
Change the names of the files, name your Classes however you want but always make sure you import and
expose everything properly on your index.js file.

Also, it's imortant to change your package.json file so you can name your pluign, provide details and more.

## Commands

- `npm run build`: builds the dist of your pluign along with the demo
- `npm run build:demo`: builds just the demo
- `npm start`: builds everything and starts the demo
- `npm start:demo`: just starts the demo

## Have fun!!!
