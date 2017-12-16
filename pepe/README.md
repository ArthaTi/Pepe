# Pepe

Pepe is a programming language, which uses only 6 characters: `r`, `e`, `R`, `E`, `!` and `?`. Others are ignored. Also, it's preffered to separate commands with a space

Pepe is stack-based and has 2 stacks: `r` and `R`. Every command starts with the stack name, defining on which stack will it work.

Ex: `REEE` operates on stack `R` while `rEEE` operates on stack `r`.

Every R/r is followed by a specific amount of E/e, which tells, what command is executed.

## List of commands

>Counter is the last element of stack.  
>Pre-counter is the element before the last in stack.  
>Pop is operation of deleting the last element of stack.  
>If stack is empty, a new item is automatically added.

**`?` and `!` are special, each is a single command. R!!! would be 3 commands, not one, unlike other operators.**

- `?` - Execute counter bitwise. 00 = r, 01 = R, 10 = e, 11 = R
- `!` - Execute counter bitwise on the current stack. 0 = e, 1 = E

### 1 E/e

- `E` - Increase counter by 1
- `e` - Decrease counter by 1

### 2 E/e

- `Ee` - Move counter to the other stack
- `EE` - Copy counter to the other stack
- `ee` - Push input to stack (parsed as integer; if it's string, it's each letter's charcode is pushed instead)
- `eE` - Push 0 to stack

### 3 E/e

- `EEE` - Output counter
- `EEe` - `EEE` and pop the stack
- `EeE` - Read counter as charcode and output it
- `Eee` - `EeE` and pop the stack
- `eEE` - Join all items and output them (ex, `13`, `37` = 1337).
- `eEe` - `eEE` and clear the stack
- `eeE` - Read all items as charcode, join and output them
- `eee` - `eeE` and clear the stack

### 4 E/e

- `EEEE` - Sum the stack and output it
- `EEEe` - `EEEE` and clear the stack
- `EEeE` - `a` = 0, for each item in stack, starting with last (going backwards); if a+item <= 255, Increase `a` by item, otherwise: read `a` as charcode and output it
- `EEee` - `EEeE` and remove affected items
- `EeEE` - Push sum of the stack
- `EeEe` - `EeEE` and clear the stack, except counter
- `EeeE` - `EEeE`, but push instead of outputting
- `Eeee` - `EEee`, but push instead of outputting
- `eEEE` - Output counter minus sum of other items
- `eEEe` - `eEEE` and clear the stack
- `eEeE` - `a` = counter, for each item in stack, starting with the element before last (going backwards); if a-item > 255, Decrease `a` by item, otherwise: read `a` as charcode and output it
- `eEee` - `eEeE` and remove affected items
- `eeEE` - `eEEE`, but push instead of outputting
- `eeEe` - `eeEE`, but clear the stack, except counter
- `eeeE` - `eEeE`, but push instead of outputting
- `eeee` - `eEee`, but push instead of outputting

### 5 E/e

- `EEEEE` - Output counter to the 2nd power
- `EEEEe` - `EEEEE`, but push instead of outputting.
- `EEEeE` - Output sqrt(counter).
- `EEEee` - Push sqrt(counter).
- `EEeEE` - Output counter to the pre-counter power. If there is only one item in the stack, the power is 2.
- `EEeEe` - `EEeEE`, but push instead of outputting.
- `EEeeE` - Output the pre-counter'th root of counter.
- `EEeee` - `EEeeE`, but push instead of outputting.

...Few coming soon functions later...

### 6 E/e soon

### 7 E/e

- `EEEEEEE` - Outputs `https://www.youtube.com/watch?v=m-NgHh36_vU` [lennyface]
- Coming soon

### 8 E/e

> 8 E/e functions push/output literal characters
>
> 8 E/e functions starting with `E` output uppercase chars, while functions starting with `e` output lowercase ones.
>
> 8 E/e functions 2nd letter decides what to do with the character: `E` outputs them, `e`, pushes their charcode.

- `EEEEE` - `a`
- `EEEEe` - `b`
- `EEEeE` - `c`
- `EEEee` - `d`
- `EEeEE` - `e`
- `EEeEe` - `f`
- `EEeeE` - `g`
- `EEeee` - `h`
- `EeEEE` - `i`
- `EeEEe` - `j`
- `EeEeE` - `k`
- `EeEee` - `l`
- `EeeEE` - `m`
- `EeeEe` - `n`
- `EeeeE` - `o`
- `Eeeee` - `p`
- `eEEEE` - `r`
- `eEEEe` - `s`
- `eEEeE` - `t`
- `eEEee` - `u`
- `eEeEE` - `v`
- `eEeEe` - `w`
- `eEeeE` - `x`
- `eEeee` - `y`
- `eeEEE` - `z`
- `eeEEe` - ` ` space
- `eeEeE` - `\n` Line feed
- `eeEee` - `\t` Tab
- `eeeEE` - `!`
- `eeeEe` - `?`
- `eeeeE` - `.`
- `eeeee` - `pepe`/`PEPE` word
