# Pepe

Pepe is a programming language, which uses only 4 characters: `r`, `e`, `R`, `E`. Others are ignored. Also, it's preffered to separate commands with a space

Pepe is stack-based and has 2 stacks: `r` and `R`. Every command starts with the stack name, defining on which stack will it work.

Ex: `REEE` operates on stack `R` while `rEEE` operates on stack `r`.

Every R/r is followed by a specific amount of E/e, which tells, what command is executed.

## Examples

### Hello, World!

```
reeEeeEeee reeEEeeEeE rEeEEeEEee reEe reEe reeEEeEEEE reeeEeEEee reeeEeeeee reeEeEeEEE reeEEeEEEE reeEEEeeEe reEe reeEEeeEee reeeEeeeeE
```

This might not be the cleanest and the shortest solution, but works. Uses the character constants and outputs `Hello, World!`.

`l` here is stored as a variable and is repeated. Every `reEe` here prints one `l`.

### Cat

```
REEE Reee 
```

Take input and print it. Just note, that if the input is a valid integer, Pepe will try to convert it to a charcode.

## List of commands

List of all commands is available [here](commands.md)
