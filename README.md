# useTranslate - simple localization for React

## Most Basic Use:

Import `{ Localize }` and wrap your `<App>` with it, listing the language options you've implemented:

```javascript
// app.js

import { Localize } from 'usetranslate';

function App() {

    const langs = ['en', 'fr-CA'];

    return (
        <Localize avail={langs}>
            <App>
        </Localize>
    );
}
```

Use the `useTranslate` hook in your components, and keep your language assets nearby but just a little bit out of the way&mdash;probably at the end of the same file.  Use the hook to translate all of the messages at once, and keep the JSX easy to read by picking property names that indicate pretty clearly what the message will say:

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

The `<Localize>` component takes the provided list of available languages (via '`avail`' prop), and uses the `accept-language` package to choose the most appropriate of the listed languages.  The language is selected immediately for the entire app context, based on the language list provided&mdash;**it is not re-selected for each translated message based on available translations.**

You can provide the user's preferred language to `<Localize>` using the '`lang`' prop. Such a string could be from the 'Accept-Language' HTTP header whcih could be sent back from the server, or could be stored on a user's profile, or an individual language tag selected from a drop-down box, etc.  It does need to be a BCP 47 compliant language tag, with the `-` not removed. Shown hard-coded to `en-US` here, for clarity:

```javascript
return (    
    <Localize avail={langs} lang="en-US">
        <App/>
    </Localize>
);
```

If '`lang`' is not specified, `Localize` attempts to use the value of the `navigator.language` property, which should work for most cases and provides for very simple basic use.  To ignore `navigator.language` completely, add an `ignoreBrowser` attribute: (not sure why you'd want to do this, as the browser language is only used as a fallback)

```javascript
return (    
    <Localize avail={langs} lang={userLang} ignoreBrowser>
        <App/>
    </Localize>
);
```

There are some additional prop options for `<Localize>` that affect how the `useTranslate` works later on:

* Use '`strict`' to throw an error if a `Messages` object is translated and is missing the preferred language.  The error will only be thrown if an attempt to translate the object is made, and only if the preferred language is missing. (Default fallback behavior is to not throw an error, but to return the object's '`name`' property, if it has one, and if not, to return any available property.)

```javascript
return (    
    <Localize avail={langs} strict>
        <App/>
    </Localize>
);
```

* Use '`flagMissing`' to put `[¿«`funny characters`»?]` around any fallback messages for which the chosen language was not available.

```javascript
return (    
    <Localize avail={langs} flagMissing>
        <App/>
    </Localize>
);
```

***

## `useTranslate`:

`useTranslate` uses React 'context' to pick up the language chosen by the `<Localize>` component, and translates an object full of objects.

Best practice for defining your language assets is to keep them close to where they're used, but a little bit out of the way&mdash;they go nicely at the end of the component file.  You define a `Messages` object (name is up to you) outside of your render function, and since module-level statements are run as the module is loaded and before the render function runs, `Messages` will be available to the render function when it needs it.  

Import `useTranslate`, give it the `Messages` object, and it gives you back the translated messages. If you store the result in a separate object called `Message` (singular), then each translated message can be read from the object nicely.

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

When translating each message, the translate function first looks for an exact match.  If it can't find one, then it looks for a '`name`' property, and returns that.  If there's no `name` property, it returns an arbitrary translation&mdash;probably the first one added to the object, but this can't be relied upon.

This behavior is modified slightly by the prop options that were passed to `Localize`: using `<Localize strict>` throws an error if a match is not found, and `<Localize flagMissing>` puts `[¿«`funny characters`»?]` around any failed matches&mdash;the idea being to draw it to the developer's attention.


***
## The `Messages` Object

There are two obvious syntaxes for declaring message contents at the end of a file.  Take your pick:

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

* First layer of property names are up to you, but `PascalCaseIsEasyToReadAndStandsOutABit`.  They are only used later to refer to your messages. Don't be afraid of being verbose&mdash;if you had left a string there in your component, it would have been the entire message.

* On the second layer, property names have to be chosen carefully.  The property looked up on the message object to choose the translated message is the language tag provided in the '`avail'` langauges list, with hyphens removed.  **Although BCP 47 language tags are not case sensitive, the typecase must match or the properties will not be found.**  Be intentional about following a convention for language tag typecase.  (Typecase only needs to match between the '`avail`' array you provide, and the object properties, it doesn't need to match the language header string received from the browser or user preferences).

Just to illustrate this problem:

The following **won't work**, even though `EN-US` is a legal langauge tag: (this is pseudocode for illustration)
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

The translator function will look for `ENUS`, not `enUS`.  Dashes are removed, but case must match between the languages specified as object properties, and the tags listed in '`avail`'.