*Translation module* provides methods for translating suitest commands and errors based
on command definition and suitest backend response.
All returned strings from translation module methods may have markdown-like formatting:

    link - [text](link){:target="_blank"}
    bold - **bold**
    new line - \n
    image (image preview)  - ![alt text](src)

wrapping and limiting should be done on fe or js api side

Translation module exports:

*testNotStartedReasons(errorCode: string): {code: string, translation: string, details: string}* - 
returns human readable error representation based on error code

*commandToString(definition, {configId}?): string* - returns human readable representation
of js api chain or test line from web application

*getErrorTitle(definition, response, {configId, configUrl, configVars}?): string* - returns 
error in human readable based on command definition and response

*getErrorTitleDescription(errorType: 'deviceIsBusy' | 'launchExpired' | 'deviceConnectionError') : string* - 
returns extended error description 

*getPropertiesErrors(definition, response, {configVars: Array<{key: string, value: string}>}): Array<{
              prop, expected, expectedExpanded?, actualExpanded?, actual, comparisonTypeRaw?}>* - 
returns human readable strings about result of checking element or 
network request properties
