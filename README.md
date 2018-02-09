# CSS Counter Content Preview

If you want to learn more about CSS Counters please read this:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters

## URL Params
```startAt```
```endAt```
```counterStyleStype```

e.g. ```http://tomerlichtash.com/css-counters-preview/?startAt=0&endAt=200&counterStyleType=hebrew```

## CSS Counters Problems
* unsupported 0 (defaults to decimal)
* unsupported minus values
* unsupported max values
* reverse values for hebrew (other rtl langs?)

* Hebrew and does not support negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-4&endAt=4&counterStyleType=hebrew
* lower-roman and does not support negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-10&endAt=10&counterStyleType=lower-roman
* lower-roman does range is up to 3999: http://tomerlichtash.com/css-counters-preview/?startAt=3995&endAt=4005&counterStyleType=lower-roman
* hebrew range is 999999: http://tomerlichtash.com/css-counters-preview/?startAt=999990&endAt=1000000&counterStyleType=hebrew
* arabic-indic supports negative numbers: http://tomerlichtash.com/css-counters-preview/?startAt=-10&endAt=10&counterStyleType=arabic-indic
* not all rtl languages suffer from this bug; arabic-indic for instance: http://tomerlichtash.com/css-counters-preview/?startAt=999990&endAt=1000000&counterStyleType=arabic-indic
* arabic-indic supports big numbers: http://tomerlichtash.com/css-counters-preview/?startAt=2000000&endAt=2000100&counterStyleType=arabic-indic