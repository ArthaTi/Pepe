# Flags

List of flags supported by Pepe

## Program flags

> Uncommented `E`'s and `e`'s occuring before any uncommented `R` or `r` create flags.

No flags exist yet. Suggest new ideas via [issues](https://github.com/Soaku/Pepe/issues).

## Command flags

> Uncommented `R` and `r`'s without following `E`'s will create command flags, which can modify how commands work.
>
> A sequence of `R/r` is changed to binary, where uppercase `R` = 1 and lowercase `r` = 0.
> 1 enables a flag, 0 disables it. All flags are `0` by default.
>
> Ex. `RrrRrRR` = `1001011`, enable flags `1`, `2`, `4`, `7`:
> 
>     1001011
>     7  4 21

1. 1 - Preserve mode. No items will be popped.
2. 2 - Insert mode. Pushed items will be inserted next to the pointer instead of pushing them to the end.
