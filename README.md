# CSS Counter Content Preview

If you want to learn more about CSS Counters please read this:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters
https://www.w3.org/TR/predefined-counter-styles/
https://github.com/w3c/predefined-counter-styles

```
@counter-style hebrew {
system: additive;
range: 1 10999;
additive-symbols: 10000 \5D9\5F3, 9000 \5D8\5F3, 8000 \5D7\5F3, 7000 \5D6\5F3, 6000 \5D5\5F3, 5000 \5D4\5F3, 4000 \5D3\5F3, 3000 \5D2\5F3, 2000 \5D1\5F3, 1000 \5D0\5F3, 400 \5EA, 300 \5E9, 200 \5E8, 100 \5E7, 90 \5E6, 80 \5E4, 70 \5E2, 60 \5E1, 50 \5E0, 40 \5DE, 30 \5DC, 20 \5DB, 19 \5D9\5D8, 18 \5D9\5D7, 17 \5D9\5D6, 16 \5D8\5D6, 15 \5D8\5D5, 10 \5D9, 9 \5D8, 8 \5D7, 7 \5D6, 6 \5D5, 5 \5D4, 4 \5D3, 3 \5D2, 2 \5D1, 1 \5D0;
/* additive-symbols: 10000 י׳, 9000 ט׳, 8000 ח׳, 7000 ז׳, 6000 ו׳, 5000 ה׳, 4000 ד׳, 3000 ג׳, 2000 ב׳, 1000 א׳, 400 ת, 300 ש, 200 ר, 100 ק, 90 צ, 80 פ, 70 ע, 60 ס, 50 נ, 40 מ, 30 ל, 20 כ, 19 יט, 18 יח, 17 יז, 16 טז, 15 טו, 10 י, 9 ט, 8 ח, 7 ז, 6 ו, 5 ה, 4 ד, 3 ג, 2 ב, 1 א; */
}
```

(https://www.w3.org/TR/predefined-counter-styles/#hebrew-styles)

## URL Params
```startAt```
```endAt```
```counterStyleStype```

e.g. ```http://tomerlichtash.com/css-counters-preview/?startAt=0&endAt=200&counterStyleType=hebrew```

## CSS Counters Problems
* unsupported 0 (defaults to decimal)
* unsupported minus values
* unsupported max values
* reverse values for hebrew (for other rtl langs as well?)
* direction problems for minus position in negative numbers

* Hebrew and does not support negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-4&endAt=4&counterStyleType=hebrew
  * Safari shows the hebrew word "אפס" for Zero
  * Chrome reverese that string and shows "ספא" instead.
  * Firefox uses the decimal value and prints 0.
* lower-roman and does not support negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-4&endAt=4&counterStyleType=lower-roman
* lower-roman does range is up to 3999: http://tomerlichtash.com/css-counters-preview/?startAt=3996&endAt=4004&counterStyleType=lower-roman
* hebrew range is 999999: http://tomerlichtash.com/css-counters-preview/?startAt=999996&endAt=1000004&counterStyleType=hebrew
* arabic-indic supports negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-10&endAt=2&counterStyleType=arabic-indic
* not all rtl languages suffer from this bug; arabic-indic for instance: http://tomerlichtash.com/css-counters-preview/?startAt=999990&endAt=1000000&counterStyleType=arabic-indic
* arabic-indic supports big numbers: http://tomerlichtash.com/css-counters-preview/?startAt=2000000&endAt=2000100&counterStyleType=arabic-indic
* unsupported zero for hebrew: http://localhost:5000/?startAt=-2&endAt=0&counterStyleType=hebrew