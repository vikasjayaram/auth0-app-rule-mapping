# Auth0 Applications to Rules Mapping

This library provides support to get all the rules that are applied to all the applications using Auth0.

### Version

1.0.0

## Installation

You need npm, nodejs installed.

```
npm install git+https://github.com/vikasjayaram/auth0-app-rule-mapping.git --save
```

What you will need?
* Create a .env file in ths project root directory.
* Add the following lines to this file
```
AUTH0_DOMAIN=myDomain
AUTH0_GLOBAL_CLIENT_ID=myGlobalClientId
AUTH0_GLOBAL_CLIENT_SECRET=myGlobalClientSecret
```
This global client id and secret is available on https://auth0.com/docs/api/v2 if you click on "API Key/Secret" near the token generator.

Import and use the library
```
var helpers = require('auth0-app-rule-mapping').Auth0Helpers;
helpers.appToRulesMapping(function (mapping) {
    // do something.
});
```
### Tips

If you need to restrict this function to a white list of users then create a rule called whitelist in the Auth0 platform
```
function (user, context, callback) {
    var whitelist = [ 'vikas.ramasethu@gmail.com' ]; //authorized users
    var userHasAccess = whitelist.some(
      function (email) {
        return email === user.email;
      });

    if (!userHasAccess) {
      return callback(new UnauthorizedError('Access denied.'));
    }

    callback(null, user, context);
}
```
Then write a webservice endpoint to fetch the data
```
router.get('/getApplicationRules', ensureLoggedIn, function (req, res, next) {
   helpers.appToRulesMapping(function (mapping) {
      res.json({result: 'Application To Rules Mapping', data: mapping});
   });
});
```
### Sample Outputs

```
{  
   "result":"Application To Rules Mapping",
   "data":[  
      {  
         "name":"Sample Application One",
         "client_id":"6ae93fe6461a49c789102819bdf7cf17",
         "rules":[  
            {  
               "rule_id":"rul_6e1653a0b002",
               "rule_name":"Allow Access during weekdays for Sample App One"
            },
            {  
               "rule_id":"rul_AFnG4budwdePjF0T",
               "rule_name":"Allow Access during weekdays for a specific App"
            },
            {  
               "rule_id":"rul_8iQZNdPIIAB35Vd2",
               "rule_name":"Whitelist"
            }
         ]
      },
      {  
         "name":"Sample App Two",
         "client_id":"f4b2887e47424d1db93f87af57e15fc9",
         "rules":[  
            {  
               "rule_id":"rul_AFnG4budwdePjF0T",
               "rule_name":"Allow Access during weekdays for a specific App"
            },
            {  
               "rule_id":"rul_8iQZNdPIIAB35Vd2",
               "rule_name":"Whitelist"
            }
         ]
      },
      {  
         "name":"All Applications",
         "client_id":"c9c0c7f0add94c6da1cfe280dcdfa055",
         "rules":[  
            {  
               "rule_id":"rul_AFnG4budwdePjF0T",
               "rule_name":"Allow Access during weekdays for a specific App"
            },
            {  
               "rule_id":"rul_8iQZNdPIIAB35Vd2",
               "rule_name":"Whitelist"
            }
         ]
      }
   ]
}
```


### Todos

 - Write Tests
 - Add Code Comments

License
----
The MIT License (MIT)

Copyright (c) 2016 Vikas Jayaram

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


