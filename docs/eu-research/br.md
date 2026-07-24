# Brazilian (BR) Street-Address Format — Research Notes

Research for the config-driven XRegExp parser. Sources: Correios (Guia de Endereçamento /
"Tudo sobre CEP"), UPU S42 Brazil, libpostal (OSM-trained), Google libaddressinput,
ParcelPath / PostGrid Brazil guides, and native logradouro references (RuaCEP, Loggi,
Central do Frete).

---

## 1. Canonical order

Brazil writes the **logradouro (street TYPE + name) FIRST**, then the **house number AFTER
the name** (usually after a comma), then the complemento, then the bairro on its own line,
and finally the **CEP + city – UF** line.

```
[Destinatário]
[Tipo] [Nome do logradouro], [número], [complemento]   <- Rua das Flores, 245, Apto 12
[Bairro]                                                <- Jardim Paulista
[CEP] [Cidade] - [UF]                                   <- 01415-000 São Paulo - SP
BRASIL
```

Flattened, comma-joined, this is:
`Rua das Flores, 245, Apto 12, Jardim Paulista, 01415-000 São Paulo - SP`.

Key facts:
- **Number follows the name**, normally after a comma: `Avenida Paulista, 1578`. A `nº`
  marker may precede it (`nº 1578`); often no marker at all.
- **Complemento** (apto / bloco / sala / andar / casa / conjunto / loja) comes **after the
  number**: `Rua das Flores, 245, Apto 12`.
- **Bairro** (neighbourhood) is a **genuine routing unit** on its own line, sitting
  **between the complemento and the CEP line**. This parser has no bairro output field, so
  it is **consumed and dropped** (the drop-prefix in `postalPattern` eats the one
  comma-segment right before the CEP).
- **CEP precedes the city** on the last line; the **2-letter UF** follows the city after a
  hyphen/en-dash (`São Paulo - SP`), a slash (`São Paulo / SP`), or a comma (`São Paulo, SP`).
  Correios canonical form is `CEP Cidade - UF` (postcode before city). A US-facing variant
  puts the CEP on its own final line after "Cidade – UF"; that after-city variant is NOT the
  model used here (see failure modes).
- Country line: `Brasil` / `Brazil` / `BR`.

---

## 2. Logradouro types (tipos de logradouro) and abbreviations

Type is at the **START** of the line, kept verbatim. Most common + Correios abbreviations:

| Full type   | Abbrev.       | Meaning                     |
|-------------|---------------|-----------------------------|
| Rua         | R.            | street (by far most common) |
| Avenida     | Av.           | avenue                      |
| Alameda     | Al.           | tree-lined street / access  |
| Travessa    | Tv. / Trav.   | cross-street                |
| Praça       | Pça. / Pca.   | square                      |
| Estrada     | Estr.         | (rural) road                |
| Rodovia     | Rod.          | highway                     |
| Largo       | Lgo.          | small square                |
| Viela       | —             | narrow lane                 |
| Ladeira     | Lad.          | slope                       |
| Viaduto     | Vd.           | viaduct                     |
| Passagem    | Pass.         | passage                     |
| Via         | —             | way                         |
| Parque      | Pq.           | park                        |
| Jardim      | Jd.           | (garden) district           |
| Quadra      | Qd.           | block (esp. Brasília/DF)     |
| Conjunto    | Cj.           | housing set                 |
| Condomínio  | Cond.         | gated complex               |
| Loteamento  | Lot.          | subdivision                 |

Full Correios list also includes Acesso, Aeroporto, Beco, Bloco, Bosque, Boulevard, Cais,
Campo, Caminho, Chácara, Colônia, Corredor, Distrito, Esplanada, Estação, Favela, Fazenda,
Feira, Ferrovia, Forte, Galeria, Granja, Ilha, Lago, Lagoa, Morro, Núcleo, Paralela,
Parque, Passarela, Pátio, Ponte, Porto, Recanto, Residencial, Servidão, Setor, Sítio,
Trecho, Trevo, Vale, Vereda, Vila.
Note: **particles** (`das`, `de`, `dos`, `do`, `da`) stay with the NAME:
"Rua **das Flores**", "Avenida **dos Estados**", "Rua **de** Santa Efigênia".

---

## 3. House number & complemento

- **Número**: digits after the name/comma (`245`, `1578`). May carry a letter suffix
  (`245-A`, `12 B`), a range (`100-110`), or a `nº`/`n.º` marker. **`s/n`** = "sem número".
- **Complemento** words (secondary unit), after the number:
  Apartamento (Apto/Apt/Ap), Bloco (Bl), Casa (Cs), Sala (Sl), Conjunto (Conj/Cj),
  Loja (Lj), Sobreloja, Cobertura (Cob), Andar, Fundos (Fds), Sobrado, Galpão,
  Quadra (Qd), Lote (Lt). A floor is often written **number-first**: `10º andar`,
  `3º andar` (handled with a dedicated number-first alternative).
- Field mapping: `number` = civic number; `civic_number_suffix` = letter/range/s-n;
  `sec_unit_type`/`sec_unit_num` = one complemento (stacked complementos are not modelled).

---

## 4. CEP (Código de Endereçamento Postal)

- **8 digits, "NNNNN-NNN"** (five digits, hyphen, three digits): `01310-100`, `20040-020`.
  A bare 8-digit form without the hyphen also exists but the hyphenated form is standard.
- The **first digit is the region** (0/1 = São Paulo state, 2 = Rio/Espírito Santo, 3 =
  Minas Gerais, 4 = Bahia/Sergipe, 5 = Pernambuco/NE, 6 = Ceará/N, 7 = DF/Centro-Oeste,
  8 = Paraná/Santa Catarina, 9 = Rio Grande do Sul). São Paulo city = 01000–05999.
- **Leading zeros are significant** and must be kept as a string ("01310-100").
- Written **before** the city on the final line (`01310-100 São Paulo - SP`). Correios
  discourages printing the literal word "CEP" on the mailing line (OCR errors), but it is
  widely seen (`CEP 01310-100`), so the parser tolerates it.

---

## 5. State (UF)

- Always the **2-letter Unidade Federativa** code on the mailing line, never the full name:
  SP, RJ, MG, RS, PR, SC, BA, PE, CE, DF, AM, PA, GO, ES, MT, MS, MA, PB, RN, AL, PI, SE,
  RO, TO, AC, AP, RR.
- Follows the city, separated by ` - ` (hyphen/en-dash), ` / `, or `, `. Emitted in
  `state`, upper-cased.

---

## 6. Accents, ç and particles

- Portuguese names carry diacritics: `á à â ã é ê í ó ô õ ú ç` — "São Paulo", "Grajaú",
  "Niterói", "Brás", "Conceição". The grammar is Unicode-aware.
- Lowercase connective particles (`de`, `da`, `do`, `das`, `dos`, `e`) stay in the NAME.

---

## 7. Country variants & PO box

- Country: `Brasil`, `Brazil`, `BRA`, `BR`.
- **Caixa Postal** = PO box: `Caixa Postal 1234` replaces the street; delivered to an
  agência, still with a CEP + city – UF line.

---

## 8. Failure modes to test

1. **Comma before number** — "Avenida Paulista, 1578" — the comma separates name from the
   number; do not read "1578" as a locality.
2. **No comma before number** — "Avenida Paulista 1578, 01310-200 São Paulo - SP" — number
   still binds to the street; the anchored place-only rule must NOT eat "Avenida Paulista
   1578," as if it were a bairro (guarded: dropped segment must end in a non-digit).
3. **Bairro drop** — "Rua Augusta, 900, Consolação, 01304-001 São Paulo - SP" — the bairro
   "Consolação" is consumed and NOT emitted; city = "São Paulo", not "Consolação".
4. **Numbered/date street name** — "Rua 25 de Março, 100", "Avenida 23 de Maio, 1500" —
   digits are part of the NAME; the trailing number is still found.
5. **`s/n`** — "Rodovia Régis Bittencourt, s/n" — number is null.
6. **Complemento "Apto 12"** — split the number from the unit; not a range.
7. **Number-first floor "10º andar"** — the number precedes the type word; map to
   sec_unit_num "10º" + type "Andar".
8. **UF separator variants** — "São Paulo - SP" vs "São Paulo, SP" vs "São Paulo / SP"
   (spaced). A no-space "São Paulo/SP" or "São Paulo-SP" is NOT split (documented limitation).
9. **Abbreviated type** — "R. da Bahia", "Av. Atlântica", "Estr. do Coco" — verbatim type.
10. **CEP leading zeros** — "01310-100", "06900-000" — keep as string.
11. **Caixa Postal** — "Caixa Postal 1234, 20010-974 Rio de Janeiro - RJ" — PO box path.
12. **Country present** — "..., São Paulo - SP, Brasil".
13. **Multiword city** — "Itapecerica da Serra", "São Bernardo do Campo", "Santa Bárbara
    d'Oeste" — city with particles/apostrophe survives.
14. **Numberless street directly before CEP with no bairro/complemento** (e.g. "Praça da Sé,
    01001-000 São Paulo - SP") — the anchored place-only rule may wrongly claim the praça as
    a locality; such lines are marked `__skip` (add an s/n or a bairro to disambiguate).

---

## Sources
- Correios — Guia de Endereçamento; "Tudo sobre CEP"; Manual API Busca CEP
  (correios.com.br/enviar/precisa-de-ajuda/…, correios.com.br/atendimento/developers/…).
- Código de Endereçamento Postal — Wikipedia (CEP structure, region digits).
- ParcelPath "Brazil Address Format"; PostGrid "Brazil Address Format".
- Native logradouro references: ruacep.com.br, loggi.com, blog.centraldofrete.com,
  superfrete.com (official Correios tipo-de-logradouro list).
- libpostal (OSM BR tagging); Google libaddressinput (BR format %O%n%N%n%A%n%D%n%Z %C-%S).
- UPU S42 Brazil postal addressing template.
