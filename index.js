import {createElement, createContext, useContext} from 'react';
import acceptLanguage from 'accept-language';

const TranslatorContext = createContext(()=>{});

export function Localize(props) {
    
    // language tag or language header string
    const language = props.lang || (!props.ignoreBrowser && navigator.language);
    
    const avail = Array.isArray(props.avail) ? props.avail : [props.avail];

    acceptLanguage.languages(avail);
    let lang = acceptLanguage.get(language);
    
    while (lang.includes('-')) lang = lang.replace('-','');
    
    function Translate (OBJ, fallback) {
        if (!OBJ) return '';
        if (typeof OBJ === 'string') return OBJ;
        if (typeof OBJ !== 'object') throw new Error('Expecting language object or string');
        if (OBJ[lang]) return OBJ[lang];
        if (props.strict) throw new Error('Chosen language not found on object');
        
        if (fallback && OBJ[fallback]) return warnAbout(OBJ[fallback]);
        if (OBJ.name) return warnAbout(OBJ.name);
        return warnAbout(OBJ[Object.keys(OBJ)[0]] || (props.flagMissing?`NO-MESSAGE`:``));
    }
    
    function warnAbout(text) {
        if (props.flagMissing) return `[¿«${text}»?]`;
        else return text;
    }

    return createElement(TranslatorContext.Provider, {value: Translate}, props.children);

}

export function useTranslate(Messages) {
    
    const Translate = useContext(TranslatorContext);

    const Translated = {};

    for (const Message in Messages) {
        Translated[Message] = Translate(Messages[Message]);
    }

    return Translated;

}