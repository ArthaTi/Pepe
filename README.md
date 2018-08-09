# Pepe

Pepe is a programming language based on a meme. It uses only 4 characters: `r`, `e`, `R`, `E`, other are ignored. It's prefered to separate commands with a space.

Pepe is stack-based and has 2 stacks: `r` and `R`. Every command starts with the stack name, defining on which stack will it work.

Ex: `REEE` operates on stack `R` while `rEEE` operates on stack `r`.

Every R/r is followed by a specific amount of E/e, which tells, what command is executed.

[You can find more on Pepe's wiki](https://github.com/Soaku/Pepe/wiki/Tutorial)

## Examples

### Hello, World!

```
reeEeeEeee reeEEeeEeE rEeEEeEEee reEe reEe reeEEeEEEE reeeEeEEee reeeEeeeee reeEeEeEEE reeEEeEEEE reeEEEeeEe reEe reeEEeeEee reeeEeeeeE
```

This might not be the cleanest and the shortest solution, but works. Uses the character constants and outputs `Hello, World!`.

`l` here is stored as a variable and is repeated. Every `reEe` here prints one `l`.

### Cat

```
REEe Reee 
```

Take input and print it.

## List of commands

List of all commands is available [here](commands.md)
