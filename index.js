import {createElement, createContext, useContext} from 'react';
const pickLanguage = require('picklanguage');

const TranslatorContext = createContext(()=>{});

export function Localize(props) {
    
    // language tag or language header string
    const language = props.lang || (!props.ignoreBrowser && navigator.language);
    
    const avail = Array.isArray(props.avail) ? props.avail : [props.avail];

    const { langTag, translate } = pickLanguage(avail, language, {
            strict: !!props.strict,
            flagMissing: props.flagMissing,
            fallback: props.fallback,  
            silent: props.silent
        });
    
    return createElement(TranslatorContext.Provider, {value: translate}, props.children);

}

export function useTranslate(MessageOrMessages) {
    
    const Translate = useContext(TranslatorContext);

    if (typeof MessageOrMessages === 'undefined') return useTranslate;
    if (typeof MessageOrMessages === 'string') return MessageOrMessages;

    const Translated = {};
    let foundObject;
    for (const message in MessageOrMessages) {
        if (typeof MessageOrMessages[message] === 'object') {
            foundObject = true;
            Translated[message] = Translate(MessageOrMessages[message]);
        } else {
            if (foundObject) throw new Error('Translation target had mixed strings and sub-objects');
            else return Translate(MessageOrMessages);
        }
    }

    return Translated;

}