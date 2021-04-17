# useTranslate - simple localization for React

## Most Basic Use:

Import `{ Localize }` and wrap it around your `<App>`, listing the available languages:

```javascript
// App.js

import { Localize } from 'usetranslate';

function App() {

    const langs = ['en', 'fr-CA'];

    return (
        <Localize avail={langs}>
            <App />
        </Localize>
    );
}
```

Import `useTranslate` into any component, and use it to translate your messages. Keep your messages with the component:

```javascript
import React from 'react';
import { useTranslate } from 'usetranslate';

function LogoutModal() {

    const Message = useTranslate(Messages);

    return (
        <PopUpWindow>
            <p>{Message.DoYouWantToLogOut}</p>
            <Button>{Message.Yes}</Button>
            <Button>{Message.No}</Button>
        </PopUpWindow>
    );

}

export default LogoutModal;

// Language Assets:

const Messages = {
    DoYouWantToLogOut: {
        en: `Do you want to log out?`,
        frCA: `Voulez-vous déconnecter?` 
    },
    Yes: {
        en: `Yes`,
        frCA: `Oui`
    },
    No: {
        en: `No`,
        frCA: `Non`
    }
}
```

***

## More Sophisticated Uses

The `<Localize>` component takes the provided list of available languages (via `avail` prop), and uses the `picklanguage` package to choose the most appropriate of the listed languages.  The language is selected by the `<Localize>` component based on the language list provided, it is not re-selected at the time of translation to choose the best language for each component.

Although `<Localize>` defaults to the browser language setting, you can (and should) allow the user to select an interface language, and you can provide it to `<Localize>` using the `lang` prop.  The value provided to `lang` can be a language tag, or a series of language tags as would be provided by the 'Accept-Language' HTTP header that could be sent back from the server. (Not all users are in their own countries and on their own computers, so it's better to provide them with a UI component or similar to select their language.) The value does need to be a BCP 47 compliant language tag, with the `-` *not* removed. The value of `lang` is shown hard-coded to `en-US` here, for clarity:

```javascript
return (    
    <Localize avail={langs} lang="en-US">
        <App/>
    </Localize>
);
```

If `lang` is not specified, `Localize` attempts to use the value of the `navigator.language` property, which provides for a very simple basic use case.  To ignore `navigator.language` completely, add an `ignoreBrowser` attribute: (not sure why you'd want to do this, as the browser language is only used as a fallback anyway)

```javascript
return (    
    <Localize avail={langs} lang={userLang} ignoreBrowser>
        <App/>
    </Localize>
);
```

There are some additional prop options for `<Localize>` that affect how the `useTranslate` works later on:

* Use `strict` to throw an error if a translation attempt is made and chosen language is missing.  The error will only be thrown if an attempt to translate the object is made, and only if the preferred language is missing. (Default fallback behavior is to *not* throw an error, but to display the object's `name` property, if present, or otherwise to return any available property.)  

```javascript
return (    
    <Localize avail={langs} strict>
        <App/>
    </Localize>
);
```

* Use `flagMissing` to put `[¿«`funny characters`»?]` around any fallback messages for which the chosen language was not available.

```javascript
return (    
    <Localize avail={langs} flagMissing>
        <App/>
    </Localize>
);
```

***

## `useTranslate`:

`useTranslate` uses React 'context' to pick up the language chosen by the `<Localize>` component, and translates an object full of message objects.

A good practice for defining your language assets is to keep them close to where they're used, such as in the component&mdash;they go nicely at the end of the component file if you're only working with a few messages and languages. You could also split them into an include file, and export the `Messages` object from `./Component-messages.js` or similar. Once you've imported `useTranslate` and you have the `Messages` object, feed `Messages` to `useTranslate` when you run the render function and it translates your messages for you.

`useTranslate` returns an object full of messages translated to the currently-selected language. If you store the result in a separate object called `Message` (singular), then the code is nicely readable: (same example as above)

```javascript
import { useTranslate } from 'usetranslate';

function LogoutModal() {

    const Message = useTranslate(Messages);

    return (
        <PopUpWindow>
            <p>{Message.DoYouWantToLogOut}</p>
            <Button>{Message.Yes}</Button>
            <Button>{Message.No}</Button>
        </PopUpWindow>
    );

}
```

When translating each message, the translate function first looks for an exact match.  If it can't find one, then it looks for a `name` property, and returns that&mdash;how useful this will be remains to be seen, but the idea is to let you see the names of objects that still need translation work.  If there's no `name` property, it returns an arbitrary translation&mdash;perhaps the first property added to the object, but this probably can't be relied upon.

Again, this behavior is modified by the prop options that were passed to `Localize`: using `<Localize strict>` throws an error if a match is not found, and `<Localize flagMissing>` puts `[¿«`funny characters`»?]` around any failed matches&mdash;the idea again being to draw it to the developer's attention.

Things obviously get a little bit wonky when language assets are missing from some messages, but if you provide translations in all of the languages you said you would provide (in the `avail` prop), things should be fine.

***
## The `Messages` Object

There are two obvious syntaxes for declaring message contents at the end of a file.  Take your pick, or let me know if you find a more elegant way of doing this:

```javascript
const Messages = {};

Messages.DoYouWantToLogOut = {
    en: `Do you want to log out?`,
    frCA: `Voulez-vous déconnecter?`
};

Messages.Yes = {en: `Yes`, frCA: `Oui`};

Messages.No = {en: `No`, frCA: `Non`};
```

Or, as shown previously:
```javascript
const Messages = {
    DoYouWantToLogOut: {
        en: `Do you want to log out?`,
        frCA: `Voulez-vous déconnecter?` 
    },
    Yes: {
        en: `Yes`,
        frCA: `Oui`
    },
    No: {
        en: `No`,
        frCA: `Non`
    }
}
```

### Property Names: 

* First layer of property names are up to you, but `PascalCaseIsEasyToReadAndStandsOutABit`.  They are only used later to refer to your messages. Don't be afraid of being verbose&mdash;if you had left a string there in your component, it would have been the entire message.  It's nice for it to look like a UI message, rather than to look like a variable.

* On the second layer, property names identifying languages have to be chosen carefully.  The property looked up on the message object to choose the translated message is the language tag provided in the '`avail'` langauges list, with hyphens removed.  Although BCP 47 language tags are not case-sensitive, JavaScript property names are case-sensitive, and the typecase must match what you provided in the `avail` prop or the properties will not be found.  Be intentional about following a convention for language tag typecase.  (Typecase only needs to match between the '`avail`' array you provide, and the object properties, it doesn't need to match the language header string received from the browser or stored user preferences).

Just to illustrate this problem:

The following **won't work**, even though `EN-US` is a legal langauge tag: (this is pseudocode for illustration purposes)
```javascript
return (
    <Localize avail={['EN-US']}>
        <App>
            {Message.Hello}
        </App>
    </Localize>
);

Messages.Hello = {enUS: 'Hello there.'};
```

The translator function will look for `ENUS`, not `enUS`, because all-caps was used in the `avail` list of languages.  Hyphens are removed, but case must match between the languages specified as object properties, and the tags listed in '`avail`'.   (This example would actually work as written, but not because it's found the language&mdash;rather because it'll fall back to the only message present on the object.)

## Questions and Comments

I'd love to hear what you think of this package. Please feel free to contact me with questions, comments, feature requests...