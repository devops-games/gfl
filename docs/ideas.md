# Ideas


## Data structures

### Formats

Data will be stored in a couple of different ways

#### JSON

 - player databases
 - When complex objects and nested data might need to be represented
 - Will not be edited by humans often

#### YAML

 - Configs
 - Application state
 - When humans are expected to edit it more frequently


## Copyright / Protected FPL data

It might be that we can't store data from FPL, that we get from the API, due to copyright usage. 

We might need to define IDs to be used in lookups via the apis using scripts/application functionality

### Storage

The optional use of SQL Lite could improve performance for CLI and Web usage


## Different ways to use GitFFL

 - **Manual mode** - editing files and using `npm` commands
 - **Web frontend** - frontend which can read and write to local files?
 - **Cli** - interactive shell cli


Reserve npm run commands for

 - starting the dev server
 - starting the cli
 - running checks

# CLI app

Add an optional CLI app that people can use interactively. 

This would help users to play the game while explaining the commands which are being executed

use popular npm packaeges like chalf, ora, commander where appropriate 

Remove any excessive npm run commands, this can just be used to perform things like starting the cli, running the web frontend etc


# Web frontend


# Bots
Allow/encourage bots/AI agents - and label them as such. Update documentation to define the use of non humands/bots/agents but ensuring they will be labeled as such for easy identification. Humans and bots will compete in different categories

They may compete in their own division

# Rules about sportsmanship

 - the idea isn't to beat this game through exploits or hacks. The community will fix those are we discover them.


# Cryptographic possibilities

 - Use of code signing, keys, time delays, unlocks etc?

Each game week a new key pair is generated and the public key shared with the community.
Users make encrypted commits using the public key
The private key is released after the embargo and users blind commitments can be viewed and validated



## Private leagues

Is it possible to use a public key to validate a join code somehow. i.e. key is in plain sight, and codes can't be used more than once? Maybe using the owners ssh key and a script