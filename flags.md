# Flags

List of flags supported by Pepe.

> Note: Pepe commands are binary numbers that can be read either bitwise or "numberwise". This has not been decided yet.
>
> - The problem with "numberwise" flags is that each number is a single flag, making mixing flags harder.
> - The problem with bitwise flags is that even if they are easy to mix, it's really inefficient. One flag is one byte.
>   Accessing flag 5 requires 5 bytes (3 in numberwise), flag 10 requires 10 bytes (4 in numberwise)
>
> Please suggest ideas via issues.

## Program flags

> Uncommented `E`'s and `e`'s occuring before any uncommented `R` or `r` create flags.

1. `r` - Global preserve mode. No items will be popped with the exception of command 
   [`re`](https://github.com/Soaku/Pepe/projects/2#card-7485469).

## Command flags

1. `r` - Preserve mode. No items will be popped.
2. `R` - Insert mode. Pushed items will be inserted next to the pointer instead of pushing them to the end.
3. `rr` - Preserve + insert.
