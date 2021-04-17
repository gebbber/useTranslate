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

export function useTranslate(Messages) {
    
    const Translate = useContext(TranslatorContext);

    const Translated = {};

    for (const Message in Messages) {
        Translated[Message] = Translate(Messages[Message]);
    }

    return Translated;

}