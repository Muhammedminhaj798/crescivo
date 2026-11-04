# Archivo subset

`archivo-subset.woff2` is Archivo (SIL OFL 1.1, see `OFL.txt`) from
https://github.com/google/fonts/tree/main/ofl/archivo, reduced to what the site uses.

Regenerate (Python, `pip install fonttools brotli`) after adding copy with characters outside the set below:

```bash
python -c "from fontTools.ttLib import TTFont; from fontTools.varLib import instancer; \
f = instancer.instantiateVariableFont(TTFont('Archivo[wdth,wght].ttf'), {'wght': (400, 600), 'wdth': (100, 125)}); \
f.save('Archivo-limited.ttf')"
python -m fontTools.subset Archivo-limited.ttf \
  --unicodes="U+0020-007E,U+00A0,U+00A9,U+00AE,U+00B7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+20B9,U+2122" \
  --layout-features="kern,liga,tnum,case" --flavor=woff2 --output-file=archivo-subset.woff2
```
