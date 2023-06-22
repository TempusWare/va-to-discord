Set up VoiceAttack and DiscordSRV
Create a new bot (in addition to the one for DiscordSRV)

Voice commands can have multiple words to trigger the same action by using this format:
\*trigger\*;\*trigger\*

For each VoiceAttack command, create an action that writes {CMD_WILDCARDKEY}|kill to the readfromme.txt file in this folder
Check 'Overwrite file if it already exists'

Create a config.json file in this folder and fill in the details
In the command line, run 'node .'
